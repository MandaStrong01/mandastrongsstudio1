/*
  # Admin and Subscription Management System

  1. New Tables
    - `user_roles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `role` (text, 'admin', 'subscriber', 'free')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - Unique constraint on user_id
      
    - `subscription_tiers`
      - `id` (uuid, primary key)
      - `name` (text, 'BASIC', 'PRO', 'STUDIO')
      - `price` (decimal)
      - `max_duration_minutes` (integer)
      - `features` (jsonb)
      - `created_at` (timestamptz)
      
    - `user_subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `tier_id` (uuid, references subscription_tiers)
      - `status` (text, 'active', 'cancelled', 'expired')
      - `started_at` (timestamptz)
      - `expires_at` (timestamptz)
      - `auto_renew` (boolean, default true)
      - `created_at` (timestamptz)
      
    - `admin_logs`
      - `id` (uuid, primary key)
      - `admin_user_id` (uuid, references auth.users)
      - `action` (text, action performed)
      - `target_user_id` (uuid, optional target user)
      - `details` (jsonb, additional info)
      - `created_at` (timestamptz)
      
  2. Security
    - Enable RLS on all tables
    - Users can view their own subscriptions
    - Only admins can view/modify user roles
    - Only admins can view admin logs
    - Admins have full access to all resources

  3. Functions
    - Helper function to check if user is admin
    - Function to grant admin access
    - Function to check subscription status
*/

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('admin', 'subscriber', 'free')) DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscription_tiers table
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  price decimal(10,2) NOT NULL,
  max_duration_minutes integer NOT NULL,
  features jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tier_id uuid REFERENCES subscription_tiers(id) NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trial')) DEFAULT 'active',
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  auto_renew boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create admin_logs table
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_expires_at ON user_subscriptions(expires_at);

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_user_id ON admin_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = check_user_id AND role = 'admin'
  );
END;
$$;

-- Helper function to check current user is admin
CREATE OR REPLACE FUNCTION current_user_is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Function to get user subscription tier
CREATE OR REPLACE FUNCTION get_user_max_duration(check_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  max_duration integer;
BEGIN
  -- Check if admin (unlimited)
  IF is_admin(check_user_id) THEN
    RETURN 180;
  END IF;
  
  -- Get max duration from active subscription
  SELECT st.max_duration_minutes INTO max_duration
  FROM user_subscriptions us
  JOIN subscription_tiers st ON us.tier_id = st.id
  WHERE us.user_id = check_user_id 
    AND us.status = 'active'
    AND (us.expires_at IS NULL OR us.expires_at > now())
  ORDER BY st.max_duration_minutes DESC
  LIMIT 1;
  
  RETURN COALESCE(max_duration, 30);
END;
$$;

-- Enable Row Level Security
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR current_user_is_admin());

CREATE POLICY "Admins can manage all roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (current_user_is_admin())
  WITH CHECK (current_user_is_admin());

-- RLS Policies for subscription_tiers
CREATE POLICY "Anyone can view subscription tiers"
  ON subscription_tiers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage subscription tiers"
  ON subscription_tiers
  FOR ALL
  TO authenticated
  USING (current_user_is_admin())
  WITH CHECK (current_user_is_admin());

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR current_user_is_admin());

CREATE POLICY "Users can insert own subscriptions"
  ON user_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions"
  ON user_subscriptions
  FOR ALL
  TO authenticated
  USING (current_user_is_admin())
  WITH CHECK (current_user_is_admin());

-- RLS Policies for admin_logs
CREATE POLICY "Admins can view all logs"
  ON admin_logs
  FOR SELECT
  TO authenticated
  USING (current_user_is_admin());

CREATE POLICY "Admins can insert logs"
  ON admin_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (current_user_is_admin());

-- Insert default subscription tiers
INSERT INTO subscription_tiers (name, price, max_duration_minutes, features) VALUES
  ('BASIC', 10.00, 30, '{"tools": 720, "export": true, "storage_gb": 10}'::jsonb),
  ('PRO', 20.00, 60, '{"tools": 720, "export": true, "storage_gb": 50, "priority_render": true}'::jsonb),
  ('STUDIO', 30.00, 150, '{"tools": 720, "export": true, "storage_gb": 200, "priority_render": true, "4k_export": true}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Update existing RLS policies to include admin override
DO $$
BEGIN
  -- Drop and recreate policies for movie_projects to include admin access
  DROP POLICY IF EXISTS "Users can view own projects" ON movie_projects;
  CREATE POLICY "Users can view own projects"
    ON movie_projects
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR current_user_is_admin());
    
  DROP POLICY IF EXISTS "Users can update own projects" ON movie_projects;
  CREATE POLICY "Users can update own projects"
    ON movie_projects
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id OR current_user_is_admin())
    WITH CHECK (auth.uid() = user_id OR current_user_is_admin());
    
  DROP POLICY IF EXISTS "Users can delete own projects" ON movie_projects;
  CREATE POLICY "Users can delete own projects"
    ON movie_projects
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id OR current_user_is_admin());

  -- Update assets table policies
  DROP POLICY IF EXISTS "Users can view own assets" ON assets;
  CREATE POLICY "Users can view own assets"
    ON assets
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR current_user_is_admin());
    
  DROP POLICY IF EXISTS "Users can update own assets" ON assets;
  CREATE POLICY "Users can update own assets"
    ON assets
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id OR current_user_is_admin())
    WITH CHECK (auth.uid() = user_id OR current_user_is_admin());
    
  DROP POLICY IF EXISTS "Users can delete own assets" ON assets;
  CREATE POLICY "Users can delete own assets"
    ON assets
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id OR current_user_is_admin());
END $$;
