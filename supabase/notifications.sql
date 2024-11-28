-- Drop existing objects if they exist
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TYPE IF EXISTS public.notification_type CASCADE;
DROP FUNCTION IF EXISTS public.create_notification(UUID, public.notification_type, TEXT, TEXT, JSONB) CASCADE;
DROP FUNCTION IF EXISTS public.notify_event_participant() CASCADE;
DROP FUNCTION IF EXISTS public.notify_event_update() CASCADE;
DROP FUNCTION IF EXISTS public.handle_notifications_updated_at() CASCADE;

-- Create enum type for notification types
CREATE TYPE public.notification_type AS ENUM (
  'event_invitation',
  'event_update',
  'event_reminder',
  'availability_request',
  'admin_message'
);

-- Create the notifications table
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES public.profile(id) ON DELETE CASCADE,
    type public.notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT notifications_pkey PRIMARY KEY (id)
);

-- Trigger function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.handle_notifications_updated_at()
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
CREATE TRIGGER set_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.handle_notifications_updated_at();

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications Policies
CREATE POLICY "Allow users to view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (recipient_id = auth.uid());

CREATE POLICY "Allow users to update their own notifications"
  ON public.notifications
  FOR UPDATE
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

CREATE POLICY "Allow inserting notifications via functions"
  ON public.notifications
  FOR INSERT
  WITH CHECK (TRUE);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;

-- Function to create a notification
CREATE OR REPLACE FUNCTION public.create_notification(
  p_recipient_id UUID,
  p_type public.notification_type,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.notifications (
    recipient_id,
    type,
    title,
    message,
    data
  ) VALUES (
    p_recipient_id,
    p_type,
    p_title,
    p_message,
    p_data
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.create_notification(UUID, public.notification_type, TEXT, TEXT, JSONB) TO authenticated;

-- Function to notify players when added to an event
CREATE OR REPLACE FUNCTION public.notify_event_participant()
RETURNS TRIGGER AS $$
DECLARE
  v_event public.calendar_events%ROWTYPE;
  v_title TEXT;
  v_message TEXT;
  v_data JSONB;
BEGIN
  -- Get event details
  SELECT * INTO v_event FROM public.calendar_events WHERE id = NEW.event_id;

  -- Compose notification
  v_title := 'You have been added to an event';
  v_message := format('You have been added to the event "%s" scheduled on %s.', v_event.title, to_char(v_event.start_time, 'YYYY-MM-DD HH24:MI'));
  v_data := jsonb_build_object('event_id', v_event.id);

  -- Create notification
  PERFORM public.create_notification(
    NEW.player_id,
    'event_invitation',
    v_title,
    v_message,
    v_data
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.notify_event_participant() TO authenticated;

-- Create trigger on event_participants insert
CREATE TRIGGER trg_notify_event_participant
AFTER INSERT ON public.event_participants
FOR EACH ROW
EXECUTE FUNCTION public.notify_event_participant();

-- Function to notify participants on event update
CREATE OR REPLACE FUNCTION public.notify_event_update()
RETURNS TRIGGER AS $$
DECLARE
  v_participant RECORD;
  v_title TEXT;
  v_message TEXT;
  v_data JSONB;
BEGIN
  FOR v_participant IN
    SELECT player_id FROM public.event_participants WHERE event_id = NEW.id
  LOOP
    v_title := 'Event Updated';
    v_message := format('The event "%s" scheduled on %s has been updated.', NEW.title, to_char(NEW.start_time, 'YYYY-MM-DD HH24:MI'));
    v_data := jsonb_build_object('event_id', NEW.id);

    -- Create notification
    PERFORM public.create_notification(
      v_participant.player_id,
      'event_update',
      v_title,
      v_message,
      v_data
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.notify_event_update() TO authenticated;

-- Create trigger on calendar_events update
CREATE TRIGGER trg_notify_event_update
AFTER UPDATE ON public.calendar_events
FOR EACH ROW
WHEN (OLD.* IS DISTINCT FROM NEW.*)
EXECUTE FUNCTION public.notify_event_update();

