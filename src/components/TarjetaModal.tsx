import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Tarjeta } from '../lib/supabase';
import { GRADIENTES_TARJETAS, obtenerGradiente } from '../utils/tarjetas';

type TarjetaModalProps = {
  isOpen: boolean;
  tarjeta?: Tarjeta | null;
  onClose: () => void;
  onSave: (tarjeta: any) => void;
};

export function TarjetaModal({ isOpen, tarjeta, onClose, onSave }: TarjetaModalProps) {
  const [nombre, setNombre] = useState('');
  const [diaCierre, setDiaCierre] = useState(15);
  const [diaVencimiento, setDiaVencimiento] = useState(25);
  const [color, setColor] = useState('gradient-1');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (tarjeta) {
        setNombre(tarjeta.nombre);
        setDiaCierre(tarjeta.dia_cierre);
        setDiaVencimiento(tarjeta.dia_vencimiento);
        setColor(tarjeta.color);
      } else {
        setNombre('');
        setDiaCierre(15);
        setDiaVencimiento(25);
        setColor('gradient-1');
      }
      setErrors({});
    }
  }, [isOpen, tarjeta]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre de la tarjeta es requerido';
    }

    if (diaCierre < 1 || diaCierre > 31) {
      newErrors.diaCierre = 'El día debe estar entre 1 y 31';
    }

    if (diaVencimiento < 1 || diaVencimiento > 31) {
      newErrors.diaVencimiento = 'El día debe estar entre 1 y 31';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const tarjetaData = {
      nombre,
      dia_cierre: diaCierre,
      dia_vencimiento: diaVencimiento,
      color,
    };

    if (tarjeta) {
      onSave({ ...tarjetaData, id: tarjeta.id });
    } else {
      onSave(tarjetaData);
    }
  };

  const generarOpcionesDias = () => {
    return Array.from({ length: 31 }, (_, i) => i + 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {tarjeta ? 'Editar Tarjeta' : 'Nueva Tarjeta'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre de la Tarjeta
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Mastercard Black BBVA, Visa Santander"
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Día de Cierre
              </label>
              <select
                value={diaCierre}
                onChange={(e) => setDiaCierre(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {generarOpcionesDias().map((dia) => (
                  <option key={dia} value={dia}>
                    Día {dia}
                  </option>
                ))}
              </select>
              {errors.diaCierre && (
                <p className="text-red-500 text-sm mt-1">{errors.diaCierre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Día de Vencimiento
              </label>
              <select
                value={diaVencimiento}
                onChange={(e) => setDiaVencimiento(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {generarOpcionesDias().map((dia) => (
                  <option key={dia} value={dia}>
                    Día {dia}
                  </option>
                ))}
              </select>
              {errors.diaVencimiento && (
                <p className="text-red-500 text-sm mt-1">{errors.diaVencimiento}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Color de Tarjeta
            </label>
            <div className="grid grid-cols-3 gap-3">
              {GRADIENTES_TARJETAS.map((gradiente) => (
                <button
                  key={gradiente.value}
                  onClick={() => setColor(gradiente.value)}
                  className={`relative h-20 rounded-lg bg-gradient-to-br ${gradiente.colors} transition-all ${
                    color === gradiente.value
                      ? 'ring-4 ring-blue-500 scale-105'
                      : 'hover:scale-105'
                  }`}
                >
                  <span className="text-white font-medium text-sm">{gradiente.label}</span>
                  {color === gradiente.value && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
            <p className="text-sm text-blue-200">
              <strong>Nota:</strong> El día de cierre determina qué gastos entran en cada resumen.
              Los gastos realizados después del cierre se incluirán en el próximo resumen.
            </p>
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-700 p-6">
            <p className="text-sm text-gray-400 mb-3">Vista previa:</p>
            <div className={`bg-gradient-to-br ${obtenerGradiente(color)} rounded-xl p-6 text-white aspect-[16/10]`}>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="w-10 h-10 bg-white/20 rounded mb-4" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{nombre || 'Nombre de tu tarjeta'}</h3>
                  <div className="space-y-1 text-sm opacity-90">
                    <p>Cierra el día: {diaCierre}</p>
                    <p>Vence el día: {diaVencimiento}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-900 px-6 py-4 flex gap-3 justify-end border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-300 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
