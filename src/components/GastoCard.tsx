import { CreditCard as Edit, Trash2, RefreshCw } from 'lucide-react';
import { Gasto } from '../lib/supabase';
import { CATEGORIAS, formatearMonto, obtenerProximaFechaPago, calcularMontoCuota } from '../utils/gastos';

type GastoCardProps = {
  gasto: Gasto;
  onEdit: (gasto: Gasto) => void;
  onDelete: (id: string) => void;
};

export function GastoCard({ gasto, onEdit, onDelete }: GastoCardProps) {
  const categoriaInfo = CATEGORIAS.find(cat => cat.value === gasto.categoria);
  const progreso = gasto.tipo === 'cuotas' && gasto.cuota_actual && gasto.cuotas_total
    ? (gasto.cuota_actual / gasto.cuotas_total) * 100
    : 0;

  const montoCuota = calcularMontoCuota(gasto);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-lg text-white">{gasto.descripcion}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(gasto)}
            className="text-blue-400 hover:text-blue-300 transition-colors p-1"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(gasto.id)}
            className="text-red-400 hover:text-red-300 transition-colors p-1"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white bg-${categoriaInfo?.color}`}>
            {gasto.categoria}
          </span>
        </div>

        <div>
          <div className="text-2xl font-bold text-white">
            {formatearMonto(montoCuota, gasto.moneda)}
          </div>
          {gasto.tipo === 'cuotas' && (
            <div className="text-sm text-gray-400">
              Total: {formatearMonto(gasto.monto, gasto.moneda)}
            </div>
          )}
        </div>

        {gasto.tipo === 'cuotas' && gasto.cuota_actual && gasto.cuotas_total && (
          <div>
            <div className="text-sm text-gray-300 mb-1">
              Cuota {gasto.cuota_actual} de {gasto.cuotas_total}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-400 h-2 rounded-full transition-all"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>
        )}

        {gasto.tipo === 'recurrente' && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white bg-purple-500">
              <RefreshCw className="w-3 h-3" />
              Mensual
            </span>
            {!gasto.activo && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white bg-gray-400">
                Inactivo
              </span>
            )}
          </div>
        )}

        {gasto.tipo === 'unico' && gasto.mes_pago && (
          <div className="text-sm text-gray-300">
            Pago único - {gasto.mes_pago.split('/').reverse().join('/')}
          </div>
        )}

        <div className="text-sm text-gray-400 pt-2 border-t border-gray-700">
          Próximo pago: {obtenerProximaFechaPago(gasto)}
        </div>
      </div>
    </div>
  );
}
