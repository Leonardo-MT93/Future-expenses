/*
  # Create gastos (expenses) table

  1. New Tables
    - `gastos`
      - `id` (uuid, primary key) - Unique identifier for each expense
      - `descripcion` (text) - Description of the expense (e.g., "Netflix", "Rent")
      - `moneda` (text) - Currency type: 'ARS' or 'USD'
      - `monto` (numeric) - Amount of the expense
      - `categoria` (text) - Category: 'Hogar', 'Suscripciones', 'Compras', 'Servicios', 'Entretenimiento', 'Otros'
      - `tipo` (text) - Type: 'unico', 'cuotas', 'recurrente'
      - `cuota_actual` (integer, nullable) - Current installment number (only for 'cuotas')
      - `cuotas_total` (integer, nullable) - Total number of installments (only for 'cuotas')
      - `mes_inicio` (text, nullable) - Start month in MM/YYYY format (for 'cuotas')
      - `mes_pago` (text, nullable) - Payment month in MM/YYYY format (for 'unico')
      - `activo` (boolean, nullable) - Active status (only for 'recurrente')
      - `fecha_creacion` (timestamptz) - Creation timestamp
      - `fecha_modificacion` (timestamptz) - Last modification timestamp
      - `user_id` (uuid) - Reference to auth.users for multi-user support
  
  2. Security
    - Enable RLS on `gastos` table
    - Add policies for authenticated users to manage their own expenses
  
  3. Indexes
    - Index on user_id for efficient querying
    - Index on moneda for filtering
*/

CREATE TABLE IF NOT EXISTS gastos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  descripcion text NOT NULL,
  moneda text NOT NULL CHECK (moneda IN ('ARS', 'USD')),
  monto numeric NOT NULL CHECK (monto > 0),
  categoria text NOT NULL CHECK (categoria IN ('Hogar', 'Suscripciones', 'Compras', 'Servicios', 'Entretenimiento', 'Otros')),
  tipo text NOT NULL CHECK (tipo IN ('unico', 'cuotas', 'recurrente')),
  cuota_actual integer CHECK (cuota_actual > 0),
  cuotas_total integer CHECK (cuotas_total > 0),
  mes_inicio text,
  mes_pago text,
  activo boolean DEFAULT true,
  fecha_creacion timestamptz DEFAULT now(),
  fecha_modificacion timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own expenses
CREATE POLICY "Users can view own gastos"
  ON gastos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own expenses
CREATE POLICY "Users can insert own gastos"
  ON gastos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own expenses
CREATE POLICY "Users can update own gastos"
  ON gastos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own expenses
CREATE POLICY "Users can delete own gastos"
  ON gastos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_gastos_user_id ON gastos(user_id);
CREATE INDEX IF NOT EXISTS idx_gastos_moneda ON gastos(moneda);
CREATE INDEX IF NOT EXISTS idx_gastos_categoria ON gastos(categoria);