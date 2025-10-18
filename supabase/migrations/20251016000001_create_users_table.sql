/*
  # Create users table for Google OAuth authentication

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique identifier for each user
      - `email` (text, unique) - User email from Google
      - `name` (text) - User full name from Google
      - `google_id` (text, unique) - Google user ID
      - `picture` (text) - User profile picture URL
      - `fecha_creacion` (timestamptz) - Creation timestamp
      - `ultima_sesion` (timestamptz) - Last login timestamp
  
  2. Security
    - Unique constraints on email and google_id
  
  3. Indexes
    - Index on email for fast lookups
    - Index on google_id for fast authentication
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  google_id text NOT NULL UNIQUE,
  picture text,
  fecha_creacion timestamptz DEFAULT now(),
  ultima_sesion timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

