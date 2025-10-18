import { neon } from '@neondatabase/serverless';

// Obtener la cadena de conexión desde las variables de entorno
const databaseUrl = import.meta.env.VITE_DATABASE_URL;

if (!databaseUrl) {
  throw new Error('VITE_DATABASE_URL no está definida en las variables de entorno');
}

// Crear cliente de Neon para ejecutar consultas SQL
export const sql = neon(databaseUrl);

// Tipos de datos
export type User = {
  id: string;
  email: string;
  name: string;
  google_id: string;
  picture?: string;
  fecha_creacion: string;
  ultima_sesion: string;
};

export type Gasto = {
  id: string;
  descripcion: string;
  moneda: 'ARS' | 'USD';
  monto: number;
  categoria: 'Hogar' | 'Suscripciones' | 'Compras' | 'Servicios' | 'Entretenimiento' | 'Otros';
  tipo: 'unico' | 'cuotas' | 'recurrente';
  cuota_actual?: number;
  cuotas_total?: number;
  mes_inicio?: string;
  mes_pago?: string;
  activo?: boolean;
  tarjeta_id?: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  user_id: string;
};

export type Tarjeta = {
  id: string;
  nombre: string;
  dia_cierre: number;
  dia_vencimiento: number;
  color: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  user_id: string;
};

