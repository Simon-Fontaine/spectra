-- Drop existing objects if they exist
DROP TABLE IF EXISTS public.profile CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;
DROP TYPE IF EXISTS public.ow_role CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_profile(UUID, JSONB) CASCADE;

-- Create custom types
CREATE TYPE public.app_role AS ENUM('user', 'admin');
CREATE TYPE public.ow_role AS ENUM(
  'off_tank',
  'main_tank',
  'flex_dps',
  'hitscan_dps',
  'flex_heal',
  'main_heal'
);

-- Create the profile table
CREATE TABLE public.profile (
    id UUID NOT NULL DEFAULT auth.uid(),
    username VARCHAR NOT NULL,
    app_role public.app_role NOT NULL DEFAULT 'user'::app_role,
    ow_role public.ow_role NOT NULL,
    avatar_url VARCHAR,
    is_substitute BOOLEAN NOT NULL DEFAULT FALSE,
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT profile_pkey PRIMARY KEY (id),
    CONSTRAINT profile_username_key UNIQUE (username),
    CONSTRAINT profile_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT profile_username_format CHECK (username ~ '^[a-zA-Z0-9_]{1,32}$')
);

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profile
    WHERE id = auth.uid() AND app_role = 'admin'::public.app_role
  );
END;
$$ LANGUAGE plpgsql;

-- Updated timestamp handler
CREATE OR REPLACE FUNCTION public.handle_updated_at()
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
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.profile
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

-- Profile Policies
CREATE POLICY "Enable read access for all users"
  ON public.profile FOR SELECT
  USING (TRUE);

CREATE POLICY "Enable insert access for users"
  ON public.profile FOR INSERT
  WITH CHECK (
    auth.uid() = id
    AND app_role = 'user'
    AND NOT EXISTS (
      SELECT 1 FROM public.profile WHERE id = auth.uid()
    )
  );

CREATE POLICY "Enable full update access for admins"
  ON public.profile FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Enable limited update access for users"
  ON public.profile FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND (
      CASE 
        WHEN public.is_admin() THEN TRUE
        ELSE 
          (profile.username IS NOT DISTINCT FROM username)
          AND (profile.app_role IS NOT DISTINCT FROM app_role)
          AND (profile.ow_role IS NOT DISTINCT FROM ow_role)
          AND (profile.avatar_url IS NOT DISTINCT FROM avatar_url)
      END
    )
  );

CREATE POLICY "Enable delete access for admins only"
  ON public.profile FOR DELETE
  USING (public.is_admin());

-- Additional Indexes
CREATE INDEX idx_profile_username ON public.profile(username);
CREATE INDEX idx_profile_app_role ON public.profile(app_role);
CREATE INDEX idx_profile_ow_role ON public.profile(ow_role);

-- Grant appropriate permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Function to update profile
CREATE OR REPLACE FUNCTION public.update_profile(
  profile_id UUID,
  updates JSONB
)
RETURNS public.profile
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  result public.profile;
  is_user_admin BOOLEAN;
  current_user_id UUID;
BEGIN
  -- Get current user info
  current_user_id := auth.uid();
  is_user_admin := public.is_admin();
  
  -- Check basic permissions
  IF NOT (is_user_admin OR current_user_id = profile_id) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- If user is not admin, only allow specific fields to be updated
  IF NOT is_user_admin THEN
    -- Remove disallowed fields
    updates := updates - ARRAY['username', 'app_role', 'ow_role', 'avatar_url'];
  END IF;

  -- Perform update with filtered fields
  UPDATE public.profile
  SET
    is_substitute = COALESCE((updates->>'is_substitute')::BOOLEAN, is_substitute),
    onboarding_completed = COALESCE((updates->>'onboarding_completed')::BOOLEAN, onboarding_completed),
    updated_at = NOW()
  WHERE id = profile_id
  RETURNING * INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Grant execute on update_profile function
GRANT EXECUTE ON FUNCTION public.update_profile(UUID, JSONB) TO authenticated;

