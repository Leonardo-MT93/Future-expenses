/*
  # Add tarjeta_id to gastos table

  1. Changes
    - Add `tarjeta_id` column to gastos table
    - Create foreign key constraint to tarjetas table
    - Create index for better query performance
  
  2. Notes
    - tarjeta_id is nullable (only required for 'cuotas' and 'recurrente' types)
    - When a tarjeta is deleted, tarjeta_id is set to NULL (not CASCADE)
*/

-- Add tarjeta_id column to gastos table
ALTER TABLE gastos 
ADD COLUMN IF NOT EXISTS tarjeta_id uuid REFERENCES tarjetas(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_gastos_tarjeta_id ON gastos(tarjeta_id);

-- Add comment to explain the column
COMMENT ON COLUMN gastos.tarjeta_id IS 'Tarjeta de crédito asociada (requerida para tipo cuotas y recurrente)';

