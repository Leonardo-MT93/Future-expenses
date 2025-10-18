import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { Tarjeta } from '../lib/db';

type TarjetaModalProps = {
  isOpen: boolean;
  tarjeta?: Tarjeta | null;
  onClose: () => void;
  onSave: (tarjeta: any) => void;
};

export function TarjetaModal({ isOpen, tarjeta, onClose, onSave }: TarjetaModalProps) {
  const [nombre, setNombre] = useState('');
  const [diaCierre, setDiaCierre] = useState(15);
  const [mesCierre, setMesCierre] = useState(new Date().getMonth() + 1);
  const [diaVencimiento, setDiaVencimiento] = useState(25);
  const [mesVencimiento, setMesVencimiento] = useState(new Date().getMonth() + 1);
  const [color, setColor] = useState('#4f46e5');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (tarjeta) {
        setNombre(tarjeta.nombre);
        setDiaCierre(tarjeta.dia_cierre);
        setMesCierre(tarjeta.mes_cierre);
        setDiaVencimiento(tarjeta.dia_vencimiento);
        setMesVencimiento(tarjeta.mes_vencimiento);
        setColor(tarjeta.color);
      } else {
        setNombre('');
        setDiaCierre(15);
        setMesCierre(new Date().getMonth() + 1);
        setDiaVencimiento(25);
        setMesVencimiento(new Date().getMonth() + 1);
        setColor('#4f46e5');
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
      mes_cierre: mesCierre,
      dia_vencimiento: diaVencimiento,
      mes_vencimiento: mesVencimiento,
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

  const generarOpcionesMeses = () => {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses.map((mes, i) => ({ valor: i + 1, nombre: mes }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {tarjeta ? 'Editar Tarjeta' : 'Nueva Tarjeta'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-400 transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Nombre de la Tarjeta
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Mastercard Black BBVA"
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.nombre}</p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-3">
                Fecha de Cierre
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Día</label>
                  <select
                    value={diaCierre}
                    onChange={(e) => setDiaCierre(parseInt(e.target.value))}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {generarOpcionesDias().map((dia) => (
                      <option key={dia} value={dia}>
                        {dia}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Mes</label>
                  <select
                    value={mesCierre}
                    onChange={(e) => setMesCierre(parseInt(e.target.value))}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {generarOpcionesMeses().map((mes) => (
                      <option key={mes.valor} value={mes.valor}>
                        {mes.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.diaCierre && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.diaCierre}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-3">
                Fecha de Vencimiento
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Día</label>
                  <select
                    value={diaVencimiento}
                    onChange={(e) => setDiaVencimiento(parseInt(e.target.value))}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {generarOpcionesDias().map((dia) => (
                      <option key={dia} value={dia}>
                        {dia}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Mes</label>
                  <select
                    value={mesVencimiento}
                    onChange={(e) => setMesVencimiento(parseInt(e.target.value))}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {generarOpcionesMeses().map((mes) => (
                      <option key={mes.valor} value={mes.valor}>
                        {mes.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.diaVencimiento && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.diaVencimiento}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-3">
              Color de Tarjeta
            </label>
            
            {/* Selector de color visual grande */}
            <div className="flex flex-col gap-4">
              {/* Input color nativo HTML5 - más fácil de usar en móvil */}
              <div className="flex items-center gap-3">
                <label className="text-xs text-gray-400 whitespace-nowrap">Selector rápido:</label>
                <div className="relative flex-1">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-12 rounded-lg cursor-pointer border-2 border-gray-600 bg-gray-700"
                    style={{ 
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      appearance: 'none',
                    }}
                  />
                </div>
                <div 
                  className="w-16 h-12 rounded-lg border-2 border-gray-600 flex-shrink-0"
                  style={{ backgroundColor: color }}
                  title="Vista previa del color"
                />
              </div>

              {/* Código de color con HexColorInput */}
              <div>
                <label className="block text-xs text-gray-400 mb-2">
                  Código hexadecimal:
                </label>
                <HexColorInput
                  color={color}
                  onChange={setColor}
                  prefixed
                  placeholder="#4f46e5"
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono uppercase"
                  style={{
                    fontFamily: 'monospace',
                  }}
                />
              </div>

              {/* Selector avanzado - expandible */}
              <details className="group">
                <summary className="text-xs text-blue-400 cursor-pointer hover:text-blue-300 transition-colors list-none flex items-center gap-2">
                  <span className="transform transition-transform group-open:rotate-90">▶</span>
                  Selector avanzado de color
                </summary>
                <div className="mt-3 p-3 bg-gray-900 rounded-lg border border-gray-700">
                  <HexColorPicker 
                    color={color} 
                    onChange={setColor}
                    style={{ width: '100%', height: '200px' }}
                  />
                </div>
              </details>

              {/* Colores predefinidos comunes para tarjetas */}
              <div>
                <label className="block text-xs text-gray-400 mb-2">
                  Colores populares:
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                  {[
                    '#1e40af', // Azul oscuro
                    '#3b82f6', // Azul
                    '#10b981', // Verde
                    '#f59e0b', // Ámbar
                    '#ef4444', // Rojo
                    '#8b5cf6', // Violeta
                    '#ec4899', // Rosa
                    '#6366f1', // Índigo
                    '#14b8a6', // Teal
                    '#f97316', // Naranja
                    '#78716c', // Piedra
                    '#1f2937', // Gris oscuro
                  ].map((presetColor) => (
                    <button
                      key={presetColor}
                      type="button"
                      onClick={() => setColor(presetColor)}
                      className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                        color.toLowerCase() === presetColor.toLowerCase()
                          ? 'border-white ring-2 ring-blue-500'
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: presetColor }}
                      title={presetColor}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-900 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors font-medium order-2 sm:order-1"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium order-1 sm:order-2"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
