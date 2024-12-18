-- Drop existing objects
DROP TABLE IF EXISTS public.replays CASCADE;
DROP TYPE IF EXISTS public.match_result CASCADE;

-- Create custom type for match results
CREATE TYPE public.match_result AS ENUM (
    'Victory',
    'Defeat',
    'Draw'
);

-- Create replays table
CREATE TABLE public.replays (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    code VARCHAR(12) NOT NULL CHECK (code ~* '^[A-Z0-9]{5,12}$'),
    map_name TEXT NOT NULL,
    map_mode TEXT NOT NULL,
    game_mode TEXT NOT NULL,
    result public.match_result NOT NULL,
    score VARCHAR(12) NOT NULL CHECK (score ~ '^\d+-\d+$'),
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    uploaded_image_url TEXT,
    notes TEXT,
    is_reviewed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT replays_pkey PRIMARY KEY (id)
    CONSTRAINT replays_code_key UNIQUE (code)
);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_timestamp_replays
    BEFORE UPDATE ON public.replays
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.replays ENABLE ROW LEVEL SECURITY;

-- Policies for replays
CREATE POLICY "Enable read access for all authenticated users" ON public.replays
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON public.replays
    FOR INSERT TO authenticated
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for admins and uploaders" ON public.replays
    FOR UPDATE TO authenticated
    USING (uploaded_by = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profile WHERE id = auth.uid() AND app_role = 'admin'
    ));

CREATE POLICY "Enable delete for admins only" ON public.replays
    FOR DELETE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profile WHERE id = auth.uid() AND app_role = 'admin'
    ));

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.replays TO authenticated;

-- Create indexes
CREATE INDEX idx_replays_code ON public.replays(code);
CREATE INDEX idx_replays_map_name ON public.replays(map_name);
CREATE INDEX idx_replays_game_mode ON public.replays(game_mode);