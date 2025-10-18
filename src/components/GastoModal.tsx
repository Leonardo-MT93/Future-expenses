import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Gasto, Tarjeta } from '../lib/db';
import { CATEGORIAS, TIPOS_GASTO, obtenerProximoMes } from '../utils/gastos';
import { obtenerTarjetas } from '../utils/tarjetas';
import { useAuth } from '../contexts/AuthContext';

type GastoModalProps = {
  isOpen: boolean;
  gasto?: Gasto | null;
  onClose: () => void;
  onSave: (gasto: any) => void;
  onDelete?: (id: string) => void;
};

export function GastoModal({ isOpen, gasto, onClose, onSave, onDelete }: GastoModalProps) {
  const { user } = useAuth();
  const [moneda, setMoneda] = useState<'ARS' | 'USD'>('ARS');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('Hogar');
  const [tipo, setTipo] = useState<'unico' | 'cuotas' | 'recurrente'>('unico');
  const [cuotaActual, setCuotaActual] = useState('');
  const [cuotasTotal, setCuotasTotal] = useState('');
  const [mesInicio, setMesInicio] = useState('');
  const [mesPago, setMesPago] = useState('');
  const [activo, setActivo] = useState(true);
  const [tarjetaId, setTarjetaId] = useState('');
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      // Cargar tarjetas del usuario
      if (user) {
        obtenerTarjetas(user.id).then(setTarjetas);
      }

      if (gasto) {
        setMoneda(gasto.moneda);
        setDescripcion(gasto.descripcion);
        setMonto(gasto.monto.toString());
        setCategoria(gasto.categoria);
        setTipo(gasto.tipo);
        setCuotaActual(gasto.cuota_actual?.toString() || '');
        setCuotasTotal(gasto.cuotas_total?.toString() || '');
        setMesInicio(gasto.mes_inicio || '');
        setMesPago(gasto.mes_pago || '');
        setActivo(gasto.activo !== false);
        setTarjetaId(gasto.tarjeta_id || '');
      } else {
        const proximo = obtenerProximoMes();
        const proximoMesStr = `${String(proximo.mesNumero).padStart(2, '0')}/${proximo.año}`;

        setMoneda('ARS');
        setDescripcion('');
        setMonto('');
        setCategoria('Hogar');
        setTipo('unico');
        setCuotaActual('');
        setCuotasTotal('');
        setMesInicio(proximoMesStr);
        setMesPago(proximoMesStr);
        setActivo(true);
        setTarjetaId('');
      }
      setErrors({});
    }
  }, [isOpen, gasto, user]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (!monto || parseFloat(monto) <= 0) {
      newErrors.monto = 'El monto debe ser mayor a 0';
    }

    if (tipo === 'cuotas') {
      if (!cuotaActual || parseInt(cuotaActual) <= 0) {
        newErrors.cuotaActual = 'La cuota actual es requerida';
      }
      if (!cuotasTotal || parseInt(cuotasTotal) <= 0) {
        newErrors.cuotasTotal = 'El total de cuotas es requerido';
      }
      if (cuotaActual && cuotasTotal && parseInt(cuotaActual) > parseInt(cuotasTotal)) {
        newErrors.cuotaActual = 'La cuota actual no puede ser mayor al total';
      }
      if (!mesInicio) {
        newErrors.mesInicio = 'El mes de inicio es requerido';
      }
    }

    if (tipo === 'unico' && !mesPago) {
      newErrors.mesPago = 'El mes de pago es requerido';
    }

    // Validar tarjeta para tipos que la requieren
    if ((tipo === 'cuotas' || tipo === 'recurrente') && !tarjetaId) {
      newErrors.tarjetaId = 'Debes seleccionar una tarjeta para gastos en cuotas o recurrentes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const gastoData: any = {
      descripcion,
      moneda,
      monto: parseFloat(monto),
      categoria,
      tipo,
    };

    if (tipo === 'cuotas') {
      gastoData.cuota_actual = parseInt(cuotaActual);
      gastoData.cuotas_total = parseInt(cuotasTotal);
      gastoData.mes_inicio = mesInicio;
      gastoData.tarjeta_id = tarjetaId;
    } else if (tipo === 'unico') {
      gastoData.mes_pago = mesPago;
      // Los gastos únicos no requieren tarjeta
    } else if (tipo === 'recurrente') {
      gastoData.activo = activo;
      gastoData.tarjeta_id = tarjetaId;
    }

    if (gasto) {
      gastoData.id = gasto.id;
    }

    onSave(gastoData);
  };

  const generarOpcionesMeses = () => {
    const opciones = [];
    const hoy = new Date();

    for (let i = 0; i < 24; i++) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() + i, 1);
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const año = fecha.getFullYear();
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      opciones.push({
        value: `${mes}/${año}`,
        label: `${meses[fecha.getMonth()]} ${año}`
      });
    }

    return opciones;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {gasto ? 'Editar Gasto' : 'Nuevo Gasto'}
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
              Moneda
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMoneda('ARS')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  moneda === 'ARS'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                ARS ($)
              </button>
              <button
                type="button"
                onClick={() => setMoneda('USD')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  moneda === 'USD'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descripción
            </label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Netflix, Cuota Auto, Alquiler"
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.descripcion && (
              <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Monto ({moneda === 'ARS' ? '$' : 'USD'})
            </label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0.00"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.monto && (
              <p className="text-red-500 text-sm mt-1">{errors.monto}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoría
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Gasto
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as 'unico' | 'cuotas' | 'recurrente')}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {TIPOS_GASTO.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {tipo === 'unico' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mes de Pago
              </label>
              <select
                value={mesPago}
                onChange={(e) => setMesPago(e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {generarOpcionesMeses().map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </select>
              {errors.mesPago && (
                <p className="text-red-500 text-sm mt-1">{errors.mesPago}</p>
              )}
            </div>
          )}

          {(tipo === 'cuotas' || tipo === 'recurrente') && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tarjeta de Crédito {tipo === 'cuotas' && <span className="text-red-500">*</span>}
              </label>
              <select
                value={tarjetaId}
                onChange={(e) => setTarjetaId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona una tarjeta</option>
                {tarjetas.map((tarjeta) => (
                  <option key={tarjeta.id} value={tarjeta.id}>
                    {tarjeta.nombre}
                  </option>
                ))}
              </select>
              {errors.tarjetaId && (
                <p className="text-red-500 text-sm mt-1">{errors.tarjetaId}</p>
              )}
              {tarjetas.length === 0 && (
                <p className="text-yellow-500 text-sm mt-1">
                  No tienes tarjetas registradas. Agrega una desde la sección Tarjetas.
                </p>
              )}
            </div>
          )}

          {tipo === 'cuotas' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cuota Actual
                  </label>
                  <input
                    type="number"
                    value={cuotaActual}
                    onChange={(e) => setCuotaActual(e.target.value)}
                    placeholder="3"
                    className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.cuotaActual && (
                    <p className="text-red-500 text-sm mt-1">{errors.cuotaActual}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total de Cuotas
                  </label>
                  <input
                    type="number"
                    value={cuotasTotal}
                    onChange={(e) => setCuotasTotal(e.target.value)}
                    placeholder="12"
                    className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.cuotasTotal && (
                    <p className="text-red-500 text-sm mt-1">{errors.cuotasTotal}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mes de Primera Cuota
                </label>
                <select
                  value={mesInicio}
                  onChange={(e) => setMesInicio(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {generarOpcionesMeses().map((opcion) => (
                    <option key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </select>
                {errors.mesInicio && (
                  <p className="text-red-500 text-sm mt-1">{errors.mesInicio}</p>
                )}
              </div>
            </>
          )}

          {tipo === 'recurrente' && (
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-300">Activo</span>
              </label>
              <p className="text-sm text-gray-400 mt-2">
                Se cobrará todos los meses hasta desactivar
              </p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-900 px-6 py-4 flex gap-3 justify-end border-t border-gray-700">
          {gasto && onDelete && (
            <button
              onClick={() => onDelete(gasto.id)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Eliminar
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
