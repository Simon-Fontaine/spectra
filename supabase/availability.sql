-- Drop existing table if it exists
DROP TABLE IF EXISTS public.availability CASCADE;
DROP FUNCTION IF EXISTS public.handle_availability_updated_at() CASCADE;

-- Create the availability table
CREATE TABLE public.availability (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES public.profile(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT availability_pkey PRIMARY KEY (id),
    CONSTRAINT availability_time_check CHECK (end_time > start_time)
);

-- Trigger function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.handle_availability_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for 'updated_at'
CREATE TRIGGER set_availability_updated_at
BEFORE UPDATE ON public.availability
FOR EACH ROW
EXECUTE FUNCTION public.handle_availability_updated_at();

-- Enable Row Level Security
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- Availability Policies
CREATE POLICY "Allow players to manage their availability"
  ON public.availability
  FOR ALL
  USING (player_id = auth.uid())
  WITH CHECK (player_id = auth.uid());

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.availability TO authenticated;

