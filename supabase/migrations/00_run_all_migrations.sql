-- ========================================
-- EJECUTAR TODAS LAS MIGRACIONES
-- ========================================
-- Este archivo combina todas las migraciones necesarias
-- Puedes ejecutarlo completo en la consola de Neon
-- ========================================

-- 1. Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  google_id text NOT NULL UNIQUE,
  picture text,
  fecha_creacion timestamptz DEFAULT now(),
  ultima_sesion timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- 2. Crear tabla de tarjetas
CREATE TABLE IF NOT EXISTS tarjetas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  dia_cierre integer NOT NULL CHECK (dia_cierre >= 1 AND dia_cierre <= 31),
  mes_cierre integer NOT NULL CHECK (mes_cierre >= 1 AND mes_cierre <= 12),
  dia_vencimiento integer NOT NULL CHECK (dia_vencimiento >= 1 AND dia_vencimiento <= 31),
  mes_vencimiento integer NOT NULL CHECK (mes_vencimiento >= 1 AND mes_vencimiento <= 12),
  color text NOT NULL DEFAULT 'gradient-1',
  fecha_creacion timestamptz DEFAULT now(),
  fecha_modificacion timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tarjetas_user_id ON tarjetas(user_id);

-- 3. Crear tabla de gastos
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
  tarjeta_id uuid REFERENCES tarjetas(id) ON DELETE SET NULL,
  fecha_creacion timestamptz DEFAULT now(),
  fecha_modificacion timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_gastos_user_id ON gastos(user_id);
CREATE INDEX IF NOT EXISTS idx_gastos_moneda ON gastos(moneda);
CREATE INDEX IF NOT EXISTS idx_gastos_categoria ON gastos(categoria);
CREATE INDEX IF NOT EXISTS idx_gastos_tarjeta_id ON gastos(tarjeta_id);

-- Agregar comentario explicativo
COMMENT ON COLUMN gastos.tarjeta_id IS 'Tarjeta de crédito asociada (requerida para tipo cuotas y recurrente)';

-- ========================================
-- ¡MIGRACIONES COMPLETADAS!
-- ========================================
-- Si no hubo errores, tu base de datos está lista para usar
-- Ahora puedes ejecutar: npm run dev
-- ========================================

