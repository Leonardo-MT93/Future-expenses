import { useEffect, useState } from 'react';
import { Plus, CreditCard, ArrowRight } from 'lucide-react';
import { calcularTotalProximoMes, formatearMonto, obtenerProximoMes, obtenerMesActual } from '../utils/gastos';
import { obtenerTarjetas } from '../utils/tarjetas';
import { Tarjeta } from '../lib/db';
import { diasHastaVencimientoTarjeta, obtenerEstadoVencimiento } from '../utils/tarjetas';
import { useAuth } from '../contexts/AuthContext';

type DashboardProps = {
  onAddGasto: () => void;
  onNavigateToTarjetas: () => void;
  refreshTrigger: number;
};

export function Dashboard({ onAddGasto, onNavigateToTarjetas, refreshTrigger }: DashboardProps) {
  const { user } = useAuth();
  const [totalARS, setTotalARS] = useState(0);
  const [totalUSD, setTotalUSD] = useState(0);
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);

  const mesActual = obtenerMesActual();
  const proximoMes = obtenerProximoMes();

  useEffect(() => {
    const cargarDatos = async () => {
      if (!user) return;
      
      const [ars, usd, tarjetasData] = await Promise.all([
        calcularTotalProximoMes(user.id, 'ARS'),
        calcularTotalProximoMes(user.id, 'USD'),
        obtenerTarjetas(user.id),
      ]);

      setTotalARS(ars);
      setTotalUSD(usd);
      setTarjetas(tarjetasData);
    };

    cargarDatos();
  }, [refreshTrigger, user]);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Mis Gastos del Próximo Mes
          </h1>
          <p className="text-gray-400">
            {mesActual.mes} {mesActual.año} → {proximoMes.mes} {proximoMes.año}
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white border border-blue-700">
            <div className="text-lg font-medium mb-2 opacity-90">Total a pagar en ARS</div>
            <div className="text-5xl font-bold">{formatearMonto(totalARS, 'ARS')}</div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl shadow-lg p-8 text-white border border-green-700">
            <div className="text-lg font-medium mb-2 opacity-90">Total a pagar en USD</div>
            <div className="text-5xl font-bold">{formatearMonto(totalUSD, 'USD')}</div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-6 h-6" />
              Mis Tarjetas
            </h2>
            <button
              onClick={onNavigateToTarjetas}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              Ver todas
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {tarjetas.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
              <p className="text-gray-400 mb-3">No tienes tarjetas registradas</p>
              <button
                onClick={onNavigateToTarjetas}
                className="text-blue-400 hover:text-blue-300 font-medium text-sm"
              >
                Agregar mi primera tarjeta
              </button>
            </div>
          ) : (
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="max-h-80 overflow-y-auto">
                {tarjetas.map((tarjeta) => {
                  const dias = diasHastaVencimientoTarjeta(tarjeta);
                  const estado = obtenerEstadoVencimiento(dias);

                  return (
                    <div
                      key={tarjeta.id}
                      className="border-b border-gray-700 last:border-b-0 p-4 hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{tarjeta.nombre}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>Cierre: día {tarjeta.dia_cierre}</span>
                            <span>•</span>
                            <span>Vencimiento: día {tarjeta.dia_vencimiento}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${estado.color} bg-gray-700`}>
                            {estado.badge}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onAddGasto}
          className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
