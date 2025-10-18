/*
  # Update gastos table to reference users table

  1. Changes
    - Drop existing foreign key constraint to auth.users
    - Remove existing RLS policies (no longer using Supabase auth)
    - Add new foreign key constraint to users table
    - Drop RLS since we'll handle auth in the application layer
*/

-- Disable Row Level Security (no longer using Supabase auth)
ALTER TABLE gastos DISABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Users can view own gastos" ON gastos;
DROP POLICY IF EXISTS "Users can insert own gastos" ON gastos;
DROP POLICY IF EXISTS "Users can update own gastos" ON gastos;
DROP POLICY IF EXISTS "Users can delete own gastos" ON gastos;

-- Drop the old foreign key constraint to auth.users if it exists
ALTER TABLE gastos 
DROP CONSTRAINT IF EXISTS gastos_user_id_fkey;

-- Add new foreign key constraint to users table
ALTER TABLE gastos 
ADD CONSTRAINT gastos_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

