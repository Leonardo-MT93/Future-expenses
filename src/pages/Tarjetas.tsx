import { useEffect, useState } from 'react';
import { Plus, CreditCard } from 'lucide-react';
import { Tarjeta } from '../lib/db';
import { obtenerTarjetas, agregarTarjeta, editarTarjeta, eliminarTarjeta, contarGastosConTarjeta } from '../utils/tarjetas';
import { TarjetaCard } from '../components/TarjetaCard';
import { TarjetaModal } from '../components/TarjetaModal';
import { useAuth } from '../contexts/AuthContext';

type TarjetasProps = {
  onTarjetaChange: () => void;
  refreshTrigger: number;
};

export function Tarjetas({ onTarjetaChange, refreshTrigger }: TarjetasProps) {
  const { user } = useAuth();
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tarjetaEditando, setTarjetaEditando] = useState<Tarjeta | null>(null);

  useEffect(() => {
    cargarTarjetas();
  }, [refreshTrigger, user]);

  const cargarTarjetas = async () => {
    if (!user) return;
    const data = await obtenerTarjetas(user.id);
    setTarjetas(data);
  };

  const handleAddTarjeta = () => {
    setTarjetaEditando(null);
    setIsModalOpen(true);
  };

  const handleEditTarjeta = (tarjeta: Tarjeta) => {
    setTarjetaEditando(tarjeta);
    setIsModalOpen(true);
  };

  const handleSaveTarjeta = async (tarjetaData: any) => {
    if (!user) return;
    
    if (tarjetaEditando) {
      await editarTarjeta(tarjetaEditando.id, tarjetaData);
    } else {
      await agregarTarjeta(user.id, tarjetaData);
    }
    setIsModalOpen(false);
    setTarjetaEditando(null);
    cargarTarjetas();
    onTarjetaChange();
  };

  const handleDeleteTarjeta = async (id: string) => {
    const count = await contarGastosConTarjeta(id);

    if (count > 0) {
      const confirmar = window.confirm(
        `Esta tarjeta tiene ${count} gasto${count > 1 ? 's' : ''} asociado${count > 1 ? 's' : ''}. Si la eliminas, estos gastos quedarán sin tarjeta asignada. ¿Deseas continuar?`
      );
      if (!confirmar) return;
    } else {
      const confirmar = window.confirm('¿Estás seguro de eliminar esta tarjeta?');
      if (!confirmar) return;
    }

    const success = await eliminarTarjeta(id);
    if (success) {
      cargarTarjetas();
      onTarjetaChange();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate">Mis Tarjetas</h1>
          <button
            onClick={handleAddTarjeta}
            className="px-3 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2 text-sm sm:text-base flex-shrink-0"
            title="Agregar tarjeta"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Agregar Tarjeta</span>
            <span className="sm:hidden">Agregar</span>
          </button>
        </div>

        {tarjetas.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-8 sm:p-12 text-center">
            <div className="text-gray-600 mb-4">
              <CreditCard className="w-16 h-16 sm:w-24 sm:h-24 mx-auto" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-200 mb-2">
              No tienes tarjetas registradas
            </h3>
            <p className="text-sm sm:text-base text-gray-400 mb-6 px-4">
              Agrega tus tarjetas de crédito para gestionar mejor tus gastos y conocer las fechas de pago
            </p>
            <button
              onClick={handleAddTarjeta}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Agregar Primera Tarjeta
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {tarjetas.map((tarjeta) => (
              <TarjetaCard
                key={tarjeta.id}
                tarjeta={tarjeta}
                onEdit={handleEditTarjeta}
                onDelete={handleDeleteTarjeta}
              />
            ))}
          </div>
        )}
      </div>

      <TarjetaModal
        isOpen={isModalOpen}
        tarjeta={tarjetaEditando}
        onClose={() => {
          setIsModalOpen(false);
          setTarjetaEditando(null);
        }}
        onSave={handleSaveTarjeta}
      />
    </div>
  );
}
