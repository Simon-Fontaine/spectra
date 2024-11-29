-- Drop existing objects if they exist
DROP TABLE IF EXISTS public.replay_codes CASCADE;
DROP TABLE IF EXISTS public.maps CASCADE;
DROP TABLE IF EXISTS public.game_modes CASCADE;
DROP TYPE IF EXISTS public.match_result CASCADE;

-- Create custom type for match results
CREATE TYPE public.match_result AS ENUM (
    'Victory',
    'Defeat',
    'Draw'
);

-- Create game_modes table
CREATE TABLE public.game_modes (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT game_modes_pkey PRIMARY KEY (id),
    CONSTRAINT game_modes_name_key UNIQUE (name)
);

-- Create maps table
CREATE TABLE public.maps (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    game_mode_id UUID NOT NULL REFERENCES public.game_modes(id),
    country TEXT,
    released_at DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT maps_pkey PRIMARY KEY (id),
    CONSTRAINT maps_name_key UNIQUE (name)
);

-- Update replay_codes table to reference maps
CREATE TABLE public.replay_codes (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    code VARCHAR(12) NOT NULL,
    map_id UUID NOT NULL REFERENCES public.maps(id),
    result public.match_result NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,
    uploaded_image_url TEXT,
    is_reviewed BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT replay_codes_pkey PRIMARY KEY (id),
    -- CONSTRAINT replay_codes_code_key UNIQUE (code),
    CONSTRAINT replay_code_format CHECK (code ~* '^[A-Z0-9]{5,12}$')
);

-- Create trigger functions for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
CREATE TRIGGER set_timestamp_game_modes
    BEFORE UPDATE ON public.game_modes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_timestamp_maps
    BEFORE UPDATE ON public.maps
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_timestamp_replay_codes
    BEFORE UPDATE ON public.replay_codes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.game_modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replay_codes ENABLE ROW LEVEL SECURITY;

-- Policies for game_modes
CREATE POLICY "Enable read access for all authenticated users" ON public.game_modes
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable write access for admins" ON public.game_modes
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profile WHERE id = auth.uid() AND app_role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profile WHERE id = auth.uid() AND app_role = 'admin'));

-- Policies for maps
CREATE POLICY "Enable read access for all authenticated users" ON public.maps
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable write access for admins" ON public.maps
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profile WHERE id = auth.uid() AND app_role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profile WHERE id = auth.uid() AND app_role = 'admin'));

-- Policies for replay_codes (same as before)
CREATE POLICY "Enable read access for all authenticated users" ON public.replay_codes
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON public.replay_codes
    FOR INSERT TO authenticated
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for admins and uploaders" ON public.replay_codes
    FOR UPDATE TO authenticated
    USING (uploaded_by = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profile WHERE id = auth.uid() AND app_role = 'admin'
    ));

CREATE POLICY "Enable delete for admins only" ON public.replay_codes
    FOR DELETE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profile WHERE id = auth.uid() AND app_role = 'admin'
    ));

-- Insert initial game modes
INSERT INTO public.game_modes (name, description) VALUES
    ('Control', 'Teams fight to capture and hold objectives'),
    ('Escort', 'One team escorts a payload while the other defends'),
    ('Flashpoint', 'Teams capture multiple objectives in any order'),
    ('Hybrid', 'Combination of assault and escort objectives'),
    ('Push', 'Teams compete to push a robot towards the enemy base'),
    ('Clash', 'Teams alternate between attack and defense rounds');

-- Helper function to add a map
CREATE OR REPLACE FUNCTION public.add_map(
    p_name TEXT,
    p_game_mode TEXT,
    p_country TEXT DEFAULT NULL,
    p_released_at DATE DEFAULT CURRENT_DATE
) RETURNS UUID AS $$
DECLARE
    v_game_mode_id UUID;
    v_map_id UUID;
BEGIN
    SELECT id INTO v_game_mode_id FROM public.game_modes WHERE name = p_game_mode;
    IF v_game_mode_id IS NULL THEN
        RAISE EXCEPTION 'Game mode % not found', p_game_mode;
    END IF;

    INSERT INTO public.maps (name, game_mode_id, country, released_at)
    VALUES (p_name, v_game_mode_id, p_country, p_released_at)
    RETURNING id INTO v_map_id;

    RETURN v_map_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON public.game_modes TO authenticated;
GRANT SELECT ON public.maps TO authenticated;
GRANT ALL ON public.replay_codes TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_map TO authenticated;

-- Create indexes
CREATE INDEX idx_maps_game_mode ON public.maps(game_mode_id);
CREATE INDEX idx_maps_active ON public.maps(is_active);
CREATE INDEX idx_game_modes_active ON public.game_modes(is_active);
CREATE INDEX idx_replay_codes_map ON public.replay_codes(map_id);
