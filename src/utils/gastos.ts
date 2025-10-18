import { sql, Gasto } from '../lib/db';
import { useAuth } from '../contexts/AuthContext';

export const CATEGORIAS = [
  { value: 'Hogar', label: 'Hogar', color: 'blue-500' },
  { value: 'Suscripciones', label: 'Suscripciones', color: 'purple-500' },
  { value: 'Compras', label: 'Compras', color: 'green-500' },
  { value: 'Servicios', label: 'Servicios', color: 'orange-500' },
  { value: 'Entretenimiento', label: 'Entretenimiento', color: 'pink-500' },
  { value: 'Otros', label: 'Otros', color: 'gray-500' },
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
  const montoFormateado = new Intl.NumberFormat('es-AR').format(monto);
  return moneda === 'ARS' ? `$${montoFormateado}` : `USD ${montoFormateado}`;
}

export function calcularMontoCuota(gasto: Gasto): number {
  if (gasto.tipo === 'cuotas' && gasto.cuotas_total && gasto.cuotas_total > 0) {
    return gasto.monto / gasto.cuotas_total;
  }
  return gasto.monto;
}

export function esPagoEnProximoMes(gasto: Gasto): boolean {
  if (gasto.tipo === 'recurrente') {
    return gasto.activo === true;
  }

  if (gasto.tipo === 'unico') {
    return true;
  }

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

    return gastos as Gasto[];
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
    .reduce((total, gasto) => total + calcularMontoCuota(gasto), 0);
}
