import { Edit, Trash2, RefreshCw, Home, Calendar, ShoppingBag, Wrench, Film, MoreHorizontal } from 'lucide-react';
import { Gasto } from '../lib/db';
import { CATEGORIAS, formatearMonto, calcularMontoCuota } from '../utils/gastos';

type GastoCardProps = {
  gasto: Gasto;
  onEdit: (gasto: Gasto) => void;
  onDelete: (id: string) => void;
};

const ICON_MAP: Record<string, any> = {
  Home,
  Calendar,
  ShoppingBag,
  Wrench,
  Film,
  MoreHorizontal,
};

export function GastoCard({ gasto, onEdit, onDelete }: GastoCardProps) {
  const categoriaInfo = CATEGORIAS.find(cat => cat.value === gasto.categoria);
  const IconComponent = categoriaInfo?.icon ? ICON_MAP[categoriaInfo.icon] : MoreHorizontal;
  
  const progreso = gasto.tipo === 'cuotas' && gasto.cuota_actual && gasto.cuotas_total
    ? (gasto.cuota_actual / gasto.cuotas_total) * 100
    : 0;

  const montoCuota = calcularMontoCuota(gasto);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 hover:bg-gray-750 transition-colors">
      <div className="flex items-center justify-between gap-3">
        {/* Lado izquierdo: Nombre y badges */}
        <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-sm text-white truncate">{gasto.descripcion}</h3>
          
          {/* Badges de categoría y tipo */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span 
              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white bg-${categoriaInfo?.color}`}
              title={gasto.categoria}
            >
              <IconComponent className="w-3.5 h-3.5" />
            </span>
            
            {gasto.tipo === 'cuotas' && gasto.cuota_actual && gasto.cuotas_total && (
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white bg-blue-500">
                {gasto.cuota_actual}/{gasto.cuotas_total}
              </span>
            )}
            
            {gasto.tipo === 'recurrente' && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium text-white bg-purple-500">
                <RefreshCw className="w-2.5 h-2.5" />
                Recurrente
              </span>
            )}
            
            {gasto.tipo === 'unico' && (
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white bg-green-500">
                Único
              </span>
            )}
            
            {gasto.tipo === 'recurrente' && !gasto.activo && (
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white bg-gray-500">
                Inactivo
              </span>
            )}
          </div>
        </div>

        {/* Lado derecho: Monto y acciones */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="text-right">
            <div className="text-base font-bold text-white">
              {formatearMonto(montoCuota, gasto.moneda)}
            </div>
            {gasto.tipo === 'cuotas' && (
              <div className="text-xs text-gray-400">
                Total: {formatearMonto(gasto.monto, gasto.moneda)}
              </div>
            )}
          </div>
          
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(gasto)}
              className="text-gray-400 hover:text-blue-400 transition-colors p-1"
              title="Editar"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(gasto.id)}
              className="text-gray-400 hover:text-red-400 transition-colors p-1"
              title="Eliminar"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Barra de progreso para cuotas */}
      {gasto.tipo === 'cuotas' && gasto.cuota_actual && gasto.cuotas_total && (
        <div className="mt-2">
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-blue-400 h-1.5 rounded-full transition-all"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
