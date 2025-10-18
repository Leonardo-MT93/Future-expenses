import { sql, Tarjeta } from '../lib/db';

export const GRADIENTES_TARJETAS = [
  { value: 'gradient-1', label: 'Azul', colors: 'from-blue-500 to-blue-700' },
  { value: 'gradient-2', label: 'Verde', colors: 'from-green-500 to-green-700' },
  { value: 'gradient-3', label: 'Púrpura', colors: 'from-purple-500 to-purple-700' },
  { value: 'gradient-4', label: 'Naranja', colors: 'from-orange-500 to-orange-700' },
  { value: 'gradient-5', label: 'Rosa', colors: 'from-pink-500 to-pink-700' },
  { value: 'gradient-6', label: 'Gris', colors: 'from-gray-600 to-gray-800' },
];

export function obtenerGradiente(colorId: string): string {
  const gradiente = GRADIENTES_TARJETAS.find(g => g.value === colorId);
  return gradiente?.colors || GRADIENTES_TARJETAS[0].colors;
}

export function calcularMesPagoConTarjeta(tarjeta: Tarjeta, fechaCompra: Date = new Date()): string {
  const diaActual = fechaCompra.getDate();
  const mesActual = fechaCompra.getMonth();
  const añoActual = fechaCompra.getFullYear();

  let mesPago: Date;

  if (diaActual <= tarjeta.dia_cierre) {
    mesPago = new Date(añoActual, mesActual + 1, 1);
  } else {
    mesPago = new Date(añoActual, mesActual + 2, 1);
  }

  const mes = String(mesPago.getMonth() + 1).padStart(2, '0');
  const año = mesPago.getFullYear();

  return `${mes}/${año}`;
}

export function obtenerNombreMesPago(tarjeta: Tarjeta, fechaCompra: Date = new Date()): string {
  const mesPagoStr = calcularMesPagoConTarjeta(tarjeta, fechaCompra);
  const [mes, año] = mesPagoStr.split('/');

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return `${meses[parseInt(mes) - 1]} ${año}`;
}

export function diasHastaVencimientoTarjeta(tarjeta: Tarjeta): number {
  const hoy = new Date();
  const diaActual = hoy.getDate();
  const mesActual = hoy.getMonth();
  const añoActual = hoy.getFullYear();

  let vencimiento = new Date(añoActual, mesActual, tarjeta.dia_vencimiento);

  if (diaActual > tarjeta.dia_vencimiento) {
    vencimiento = new Date(añoActual, mesActual + 1, tarjeta.dia_vencimiento);
  }

  const diferencia = vencimiento.getTime() - hoy.getTime();
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
}

export function obtenerEstadoVencimiento(dias: number): { color: string; badge: string; borderColor: string } {
  if (dias < 7) {
    return {
      color: 'text-red-600',
      badge: 'PRÓXIMO A VENCER',
      borderColor: 'border-red-500'
    };
  } else if (dias < 15) {
    return {
      color: 'text-yellow-600',
      badge: `Vence en ${dias} días`,
      borderColor: 'border-yellow-500'
    };
  } else {
    return {
      color: 'text-green-600',
      badge: `Vence en ${dias} días`,
      borderColor: 'border-green-500'
    };
  }
}

export async function obtenerTarjetas(userId: string): Promise<Tarjeta[]> {
  try {
    const tarjetas = await sql`
      SELECT * FROM tarjetas 
      WHERE user_id = ${userId}
      ORDER BY fecha_creacion DESC
    `;
    return tarjetas as Tarjeta[];
  } catch (error) {
    console.error('Error al obtener tarjetas:', error);
    return [];
  }
}

export async function obtenerTarjetaPorId(id: string): Promise<Tarjeta | null> {
  try {
    const tarjetas = await sql`
      SELECT * FROM tarjetas WHERE id = ${id}
    `;
    return tarjetas.length > 0 ? (tarjetas[0] as Tarjeta) : null;
  } catch (error) {
    console.error('Error al obtener tarjeta:', error);
    return null;
  }
}

export async function agregarTarjeta(userId: string, tarjeta: Omit<Tarjeta, 'id' | 'fecha_creacion' | 'fecha_modificacion' | 'user_id'>): Promise<Tarjeta | null> {
  try {
    const result = await sql`
      INSERT INTO tarjetas (nombre, dia_cierre, dia_vencimiento, color, user_id)
      VALUES (${tarjeta.nombre}, ${tarjeta.dia_cierre}, ${tarjeta.dia_vencimiento}, ${tarjeta.color}, ${userId})
      RETURNING *
    `;
    return result[0] as Tarjeta;
  } catch (error) {
    console.error('Error al agregar tarjeta:', error);
    return null;
  }
}

export async function editarTarjeta(id: string, tarjetaActualizada: Partial<Tarjeta>): Promise<Tarjeta | null> {
  try {
    const result = await sql`
      UPDATE tarjetas 
      SET 
        nombre = COALESCE(${tarjetaActualizada.nombre || null}, nombre),
        dia_cierre = COALESCE(${tarjetaActualizada.dia_cierre || null}, dia_cierre),
        dia_vencimiento = COALESCE(${tarjetaActualizada.dia_vencimiento || null}, dia_vencimiento),
        color = COALESCE(${tarjetaActualizada.color || null}, color),
        fecha_modificacion = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return result.length > 0 ? (result[0] as Tarjeta) : null;
  } catch (error) {
    console.error('Error al editar tarjeta:', error);
    return null;
  }
}

export async function eliminarTarjeta(id: string): Promise<boolean> {
  try {
    await sql`
      DELETE FROM tarjetas WHERE id = ${id}
    `;
    return true;
  } catch (error) {
    console.error('Error al eliminar tarjeta:', error);
    return false;
  }
}

export async function contarGastosConTarjeta(tarjetaId: string): Promise<number> {
  try {
    const result = await sql`
      SELECT COUNT(*) as count FROM gastos WHERE tarjeta_id = ${tarjetaId}
    `;
    return Number(result[0].count) || 0;
  } catch (error) {
    console.error('Error al contar gastos con tarjeta:', error);
    return 0;
  }
}
