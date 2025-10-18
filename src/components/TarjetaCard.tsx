import { Edit, Trash2, CreditCard } from 'lucide-react';
import { Tarjeta } from '../lib/db';
import { obtenerProximoCierre, obtenerProximoVencimiento } from '../utils/tarjetas';

type TarjetaCardProps = {
  tarjeta: Tarjeta;
  onEdit: (tarjeta: Tarjeta) => void;
  onDelete: (id: string) => void;
};

export function TarjetaCard({ tarjeta, onEdit, onDelete }: TarjetaCardProps) {
  const proximoCierre = obtenerProximoCierre(tarjeta);
  const proximoVencimiento = obtenerProximoVencimiento(tarjeta);
  const añoActual = new Date().getFullYear();
  
  const formatearFecha = (fecha: { dia: number; mes: number; fecha: Date }) => {
    const año = fecha.fecha.getFullYear();
    const mostrarAño = año !== añoActual;
    return `${fecha.dia}/${fecha.mes.toString().padStart(2, '0')}${mostrarAño ? `/${año}` : ''}`;
  };

  return (
    <div 
      className="relative rounded-xl shadow-lg p-4 text-white hover:scale-105 transition-transform"
      style={{ backgroundColor: tarjeta.color }}
    >
      <div className="absolute top-2 right-2 flex gap-1">
        <button
          onClick={() => onEdit(tarjeta)}
          className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors backdrop-blur-sm"
          title="Editar tarjeta"
        >
          <Edit className="w-3.5 h-3.5 text-white" />
        </button>
        <button
          onClick={() => onDelete(tarjeta.id)}
          className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors backdrop-blur-sm"
          title="Eliminar tarjeta"
        >
          <Trash2 className="w-3.5 h-3.5 text-white" />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <CreditCard className="w-8 h-8 opacity-70" />
        </div>

        <div className="pr-16">
          <h3 className="text-base font-bold mb-2 truncate">{tarjeta.nombre}</h3>

          <div className="flex gap-4 text-xs opacity-90">
            <p>Cierre: {formatearFecha(proximoCierre)}</p>
            <p>Venc: {formatearFecha(proximoVencimiento)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
