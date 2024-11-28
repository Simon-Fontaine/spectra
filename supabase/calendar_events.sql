-- Drop existing objects if they exist
DROP TABLE IF EXISTS public.calendar_events CASCADE;
DROP TYPE IF EXISTS public.event_type CASCADE;
DROP FUNCTION IF EXISTS public.handle_calendar_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.check_event_conflicts(TIMESTAMPTZ, TIMESTAMPTZ, UUID) CASCADE;

-- Create custom types
CREATE TYPE public.event_type AS ENUM(
  'practice',
  'tournament',
  'scrim'
);

-- Create the calendar_events table
CREATE TABLE public.calendar_events (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    event_type public.event_type NOT NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    location TEXT,
    CONSTRAINT calendar_events_pkey PRIMARY KEY (id),
    CONSTRAINT calendar_events_date_check CHECK (end_time > start_time)
);

-- Updated timestamp handler
CREATE OR REPLACE FUNCTION public.handle_calendar_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_calendar_updated_at
BEFORE UPDATE ON public.calendar_events
FOR EACH ROW
EXECUTE FUNCTION public.handle_calendar_updated_at();

-- Enable Row Level Security
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Calendar Event Policies
CREATE POLICY "Enable read access for all authenticated users"
  ON public.calendar_events FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users"
  ON public.calendar_events FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for event creators or admins"
  ON public.calendar_events FOR UPDATE
  USING (created_by = auth.uid() OR public.is_admin())
  WITH CHECK (created_by = auth.uid() OR public.is_admin());

CREATE POLICY "Enable delete access for admins"
  ON public.calendar_events FOR DELETE
  USING (public.is_admin());

-- Create helper function to check event conflicts
CREATE OR REPLACE FUNCTION public.check_event_conflicts(
  p_start_time TIMESTAMPTZ,
  p_end_time TIMESTAMPTZ,
  p_exclude_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.calendar_events
    WHERE (start_time, end_time) OVERLAPS (p_start_time, p_end_time)
    AND (p_exclude_id IS NULL OR id != p_exclude_id)
  );
END;
$$ LANGUAGE plpgsql;

-- Additional Indexes
CREATE INDEX idx_calendar_events_date_range 
  ON public.calendar_events(start_time, end_time);
CREATE INDEX idx_calendar_events_type 
  ON public.calendar_events(event_type);
CREATE INDEX idx_calendar_events_created_by 
  ON public.calendar_events(created_by);

-- Grant appropriate permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.calendar_events TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_event_conflicts(TIMESTAMPTZ, TIMESTAMPTZ, UUID) TO authenticated;

