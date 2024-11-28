-- Drop existing table if it exists
DROP TABLE IF EXISTS public.event_participants CASCADE;

-- Create the event_participants table
CREATE TABLE public.event_participants (
    event_id UUID NOT NULL REFERENCES public.calendar_events(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES public.profile(id) ON DELETE CASCADE,
    role public.ow_role NOT NULL,
    is_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT event_participants_pkey PRIMARY KEY (event_id, player_id)
);

-- Enable Row Level Security
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

-- Event Participants Policies
CREATE POLICY "Allow players to view their event participation"
  ON public.event_participants
  FOR SELECT
  USING (player_id = auth.uid() OR public.is_admin());

CREATE POLICY "Allow players to confirm participation"
  ON public.event_participants
  FOR UPDATE
  USING (player_id = auth.uid())
  WITH CHECK (player_id = auth.uid() AND is_confirmed = TRUE);

CREATE POLICY "Allow admins to manage event participants"
  ON public.event_participants
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_participants TO authenticated;

