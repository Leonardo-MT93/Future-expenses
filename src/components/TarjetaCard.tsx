import { Edit, Trash2, CreditCard } from 'lucide-react';
import { Tarjeta } from '../lib/supabase';
import { obtenerGradiente, diasHastaVencimientoTarjeta, obtenerEstadoVencimiento } from '../utils/tarjetas';

type TarjetaCardProps = {
  tarjeta: Tarjeta;
  onEdit: (tarjeta: Tarjeta) => void;
  onDelete: (id: string) => void;
};

export function TarjetaCard({ tarjeta, onEdit, onDelete }: TarjetaCardProps) {
  const dias = diasHastaVencimientoTarjeta(tarjeta);
  const estado = obtenerEstadoVencimiento(dias);
  const gradiente = obtenerGradiente(tarjeta.color);

  return (
    <div className={`relative bg-gradient-to-br ${gradiente} rounded-xl shadow-lg p-6 text-white aspect-[16/10] border-2 ${estado.borderColor} hover:scale-105 transition-transform`}>
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => onEdit(tarjeta)}
          className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors backdrop-blur-sm"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(tarjeta.id)}
          className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors backdrop-blur-sm"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col h-full justify-between">
        <div>
          <CreditCard className="w-10 h-10 mb-4 opacity-80" />
        </div>

        <div>
          <h3 className="text-xl font-bold mb-3">{tarjeta.nombre}</h3>

          <div className="space-y-1 text-sm opacity-90">
            <p>Cierra el día: {tarjeta.dia_cierre}</p>
            <p>Vence el día: {tarjeta.dia_vencimiento}</p>
          </div>

          <div className="mt-3">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-white ${estado.color}`}>
              {estado.badge}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
