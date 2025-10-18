import { sql, Gasto } from '../lib/db';
import { useAuth } from '../contexts/AuthContext';

export const CATEGORIAS = [
  { value: 'Hogar', label: 'Hogar', color: 'blue-500', icon: 'Home' },
  { value: 'Suscripciones', label: 'Suscripciones', color: 'purple-500', icon: 'Calendar' },
  { value: 'Compras', label: 'Compras', color: 'green-500', icon: 'ShoppingBag' },
  { value: 'Servicios', label: 'Servicios', color: 'orange-500', icon: 'Wrench' },
  { value: 'Entretenimiento', label: 'Entretenimiento', color: 'pink-500', icon: 'Film' },
  { value: 'Otros', label: 'Otros', color: 'gray-500', icon: 'MoreHorizontal' },
];

export const TIPOS_GASTO = [
  { value: 'unico', label: 'Pago único' },
  { value: 'cuotas', label: 'Pago en cuotas' },
  { value: 'recurrente', label: 'Pago recurrente mensual' },
];

export function obtenerProximoMes(): { mes: string, año: number, mesNumero: number } {
  const hoy = new Date();
  const proximoMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return {
    mes: meses[proximoMes.getMonth()],
    año: proximoMes.getFullYear(),
    mesNumero: proximoMes.getMonth() + 1
  };
}

export function obtenerMesActual(): { mes: string, año: number, mesNumero: number } {
  const hoy = new Date();

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return {
    mes: meses[hoy.getMonth()],
    año: hoy.getFullYear(),
    mesNumero: hoy.getMonth() + 1
  };
}

export function formatearMonto(monto: number, moneda: 'ARS' | 'USD'): string {
  const montoNumerico = Number(monto);
  const montoFormateado = new Intl.NumberFormat('es-AR', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 2 
  }).format(montoNumerico);
  return moneda === 'ARS' ? `$${montoFormateado}` : `USD ${montoFormateado}`;
}

export function calcularMontoCuota(gasto: Gasto): number {
  const monto = Number(gasto.monto);
  if (gasto.tipo === 'cuotas' && gasto.cuotas_total && gasto.cuotas_total > 0) {
    return monto / Number(gasto.cuotas_total);
  }
  return monto;
}

export function esPagoEnProximoMes(gasto: Gasto): boolean {
  const hoy = new Date();
  const proximoMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);
  const mesProximo = (proximoMes.getMonth() + 1).toString().padStart(2, '0');
  const añoProximo = proximoMes.getFullYear().toString();

  // Gastos recurrentes: solo si están activos
  if (gasto.tipo === 'recurrente') {
    return gasto.activo === true;
  }

  // Gastos únicos: solo si el mes de pago es el próximo mes
  if (gasto.tipo === 'unico' && gasto.mes_pago) {
    const [mesPago, añoPago] = gasto.mes_pago.split('/');
    return mesPago === mesProximo && añoPago === añoProximo;
  }

  // Gastos en cuotas: solo si aún hay cuotas pendientes
  if (gasto.tipo === 'cuotas' && gasto.cuota_actual && gasto.cuotas_total) {
    return gasto.cuota_actual <= gasto.cuotas_total;
  }

  return false;
}

export function obtenerProximaFechaPago(gasto: Gasto): string {
  const proximo = obtenerProximoMes();

  if (gasto.tipo === 'recurrente') {
    return `${proximo.mes} ${proximo.año}`;
  }

  if (gasto.tipo === 'unico' && gasto.mes_pago) {
    const [mes, año] = gasto.mes_pago.split('/');
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${meses[parseInt(mes) - 1]} ${año}`;
  }

  if (gasto.tipo === 'cuotas' && gasto.mes_inicio && gasto.cuota_actual) {
    const [mesInicio, añoInicio] = gasto.mes_inicio.split('/').map(Number);
    const fechaInicio = new Date(añoInicio, mesInicio - 1, 1);
    const mesesDesdeInicio = gasto.cuota_actual - 1;
    const fechaCuotaActual = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth() + mesesDesdeInicio, 1);

    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${meses[fechaCuotaActual.getMonth()]} ${fechaCuotaActual.getFullYear()}`;
  }

  return '-';
}

export async function obtenerGastos(userId: string, moneda?: 'ARS' | 'USD'): Promise<Gasto[]> {
  try {
    let gastos;
    
    if (moneda) {
      gastos = await sql`
        SELECT * FROM gastos 
        WHERE user_id = ${userId} AND moneda = ${moneda}
        ORDER BY fecha_creacion DESC
      `;
    } else {
      gastos = await sql`
        SELECT * FROM gastos 
        WHERE user_id = ${userId}
        ORDER BY fecha_creacion DESC
      `;
    }

    // Asegurar que los valores numéricos sean números, no strings
    return gastos.map(gasto => ({
      ...gasto,
      monto: Number(gasto.monto),
      cuota_actual: gasto.cuota_actual ? Number(gasto.cuota_actual) : undefined,
      cuotas_total: gasto.cuotas_total ? Number(gasto.cuotas_total) : undefined,
    })) as Gasto[];
  } catch (error) {
    console.error('Error al obtener gastos:', error);
    return [];
  }
}

export async function agregarGasto(userId: string, gasto: Omit<Gasto, 'id' | 'fecha_creacion' | 'fecha_modificacion' | 'user_id'>): Promise<Gasto | null> {
  try {
    const result = await sql`
      INSERT INTO gastos (
        descripcion, moneda, monto, categoria, tipo,
        cuota_actual, cuotas_total, mes_inicio, mes_pago, activo, tarjeta_id,
        user_id
      ) VALUES (
        ${gasto.descripcion}, ${gasto.moneda}, ${gasto.monto}, ${gasto.categoria}, ${gasto.tipo},
        ${gasto.cuota_actual || null}, ${gasto.cuotas_total || null}, 
        ${gasto.mes_inicio || null}, ${gasto.mes_pago || null}, 
        ${gasto.activo !== undefined ? gasto.activo : true}, 
        ${gasto.tarjeta_id || null},
        ${userId}
      )
      RETURNING *
    `;

    return result[0] as Gasto;
  } catch (error) {
    console.error('Error al agregar gasto:', error);
    return null;
  }
}

export async function editarGasto(id: string, gastoActualizado: Partial<Gasto>): Promise<Gasto | null> {
  try {
    const result = await sql`
      UPDATE gastos 
      SET 
        descripcion = COALESCE(${gastoActualizado.descripcion || null}, descripcion),
        moneda = COALESCE(${gastoActualizado.moneda || null}, moneda),
        monto = COALESCE(${gastoActualizado.monto || null}, monto),
        categoria = COALESCE(${gastoActualizado.categoria || null}, categoria),
        tipo = COALESCE(${gastoActualizado.tipo || null}, tipo),
        cuota_actual = ${gastoActualizado.cuota_actual || null},
        cuotas_total = ${gastoActualizado.cuotas_total || null},
        mes_inicio = ${gastoActualizado.mes_inicio || null},
        mes_pago = ${gastoActualizado.mes_pago || null},
        activo = COALESCE(${gastoActualizado.activo !== undefined ? gastoActualizado.activo : null}, activo),
        tarjeta_id = ${gastoActualizado.tarjeta_id || null},
        fecha_modificacion = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return result.length > 0 ? (result[0] as Gasto) : null;
  } catch (error) {
    console.error('Error al editar gasto:', error);
    return null;
  }
}

export async function eliminarGasto(id: string): Promise<boolean> {
  try {
    await sql`
      DELETE FROM gastos WHERE id = ${id}
    `;
    return true;
  } catch (error) {
    console.error('Error al eliminar gasto:', error);
    return false;
  }
}

export function ordenarGastos(gastos: Gasto[], criterio: string): Gasto[] {
  const gastosOrdenados = [...gastos];

  switch (criterio) {
    case 'monto_desc':
      return gastosOrdenados.sort((a, b) => calcularMontoCuota(b) - calcularMontoCuota(a));
    case 'monto_asc':
      return gastosOrdenados.sort((a, b) => calcularMontoCuota(a) - calcularMontoCuota(b));
    case 'proximo_pago':
      return gastosOrdenados.sort((a, b) => {
        const fechaA = obtenerProximaFechaPago(a);
        const fechaB = obtenerProximaFechaPago(b);
        return fechaA.localeCompare(fechaB);
      });
    default:
      return gastosOrdenados;
  }
}

export function filtrarPorCategoria(gastos: Gasto[], categoria: string): Gasto[] {
  if (categoria === 'Todas') {
    return gastos;
  }
  return gastos.filter(gasto => gasto.categoria === categoria);
}

export async function calcularTotalProximoMes(userId: string, moneda: 'ARS' | 'USD'): Promise<number> {
  const gastos = await obtenerGastos(userId, moneda);
  return gastos
    .filter(gasto => esPagoEnProximoMes(gasto))
    .reduce((total, gasto) => Number(total) + Number(calcularMontoCuota(gasto)), 0);
}
