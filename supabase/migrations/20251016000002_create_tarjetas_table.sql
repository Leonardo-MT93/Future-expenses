/*
  # Create tarjetas (credit cards) table

  1. New Tables
    - `tarjetas`
      - `id` (uuid, primary key) - Unique identifier for each card
      - `nombre` (text) - Card name (e.g., "Visa Gold", "Mastercard")
      - `dia_cierre` (integer) - Day of month when card closes (1-31)
      - `dia_vencimiento` (integer) - Day of month when payment is due (1-31)
      - `color` (text) - Color/gradient identifier for UI
      - `fecha_creacion` (timestamptz) - Creation timestamp
      - `fecha_modificacion` (timestamptz) - Last modification timestamp
      - `user_id` (uuid) - Reference to users table
  
  2. Security
    - Foreign key to users table with CASCADE delete
  
  3. Indexes
    - Index on user_id for efficient querying
*/

CREATE TABLE IF NOT EXISTS tarjetas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  dia_cierre integer NOT NULL CHECK (dia_cierre >= 1 AND dia_cierre <= 31),
  dia_vencimiento integer NOT NULL CHECK (dia_vencimiento >= 1 AND dia_vencimiento <= 31),
  color text NOT NULL DEFAULT 'gradient-1',
  fecha_creacion timestamptz DEFAULT now(),
  fecha_modificacion timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_tarjetas_user_id ON tarjetas(user_id);

