/*
  # Add month fields to tarjetas table

  1. Changes
    - Add `mes_cierre` (integer) - Month when card closes (1-12)
    - Add `mes_vencimiento` (integer) - Month when payment is due (1-12)
    - Set default values based on current date for existing records
  
  2. Notes
    - This allows cards to have specific month/day combinations for closure and due dates
    - Critical for accurate billing period calculations
*/

-- Add the new columns with constraints
ALTER TABLE tarjetas 
ADD COLUMN IF NOT EXISTS mes_cierre integer CHECK (mes_cierre >= 1 AND mes_cierre <= 12),
ADD COLUMN IF NOT EXISTS mes_vencimiento integer CHECK (mes_vencimiento >= 1 AND mes_vencimiento <= 12);

-- Set default values for existing records (use current month as default)
UPDATE tarjetas 
SET 
  mes_cierre = EXTRACT(MONTH FROM CURRENT_DATE)::integer,
  mes_vencimiento = EXTRACT(MONTH FROM CURRENT_DATE)::integer
WHERE mes_cierre IS NULL OR mes_vencimiento IS NULL;

-- Now make the columns NOT NULL
ALTER TABLE tarjetas 
ALTER COLUMN mes_cierre SET NOT NULL,
ALTER COLUMN mes_vencimiento SET NOT NULL;

