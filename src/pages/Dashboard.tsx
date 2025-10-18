import { useEffect, useState } from 'react';
import { Plus, CreditCard, ArrowRight, LogOut, User } from 'lucide-react';
import { calcularTotalProximoMes, formatearMonto, obtenerProximoMes, obtenerMesActual } from '../utils/gastos';
import { obtenerTarjetas, diasHastaVencimientoTarjeta, obtenerProximoCierre, obtenerProximoVencimiento } from '../utils/tarjetas';
import { Tarjeta } from '../lib/db';
import { useAuth } from '../contexts/AuthContext';

type DashboardProps = {
  onAddGasto: () => void;
  onNavigateToTarjetas: () => void;
  refreshTrigger: number;
};

export function Dashboard({ onAddGasto, onNavigateToTarjetas, refreshTrigger }: DashboardProps) {
  const { user, logout } = useAuth();
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

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Header con nombre de usuario y logout */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-full p-2">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Bienvenido</p>
                <p className="text-lg font-semibold text-white">{user?.name || 'Usuario'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            Mis Gastos del Próximo Mes
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            {mesActual.mes} {mesActual.año} → {proximoMes.mes} {proximoMes.año}
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 sm:p-8 text-white border border-blue-700">
            <div className="text-sm sm:text-base md:text-lg font-medium mb-2 opacity-90">Total a pagar en ARS</div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold break-words">{formatearMonto(totalARS, 'ARS')}</div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl shadow-lg p-6 sm:p-8 text-white border border-green-700">
            <div className="text-sm sm:text-base md:text-lg font-medium mb-2 opacity-90">Total a pagar en USD</div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold break-words">{formatearMonto(totalUSD, 'USD')}</div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="hidden sm:inline">Mis Tarjetas</span>
              <span className="sm:hidden">Tarjetas</span>
            </h2>
            <button
              onClick={onNavigateToTarjetas}
              className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm font-medium flex items-center gap-1 transition-colors"
            >
              <span className="hidden sm:inline">Ver todas</span>
              <span className="sm:hidden">Ver</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

          {tarjetas.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 text-center">
              <p className="text-gray-400 mb-3 text-sm sm:text-base">No tienes tarjetas registradas</p>
              <button
                onClick={onNavigateToTarjetas}
                className="text-blue-400 hover:text-blue-300 font-medium text-xs sm:text-sm"
              >
                Agregar mi primera tarjeta
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {tarjetas.map((tarjeta) => {
                const dias = diasHastaVencimientoTarjeta(tarjeta);
                const proximoCierre = obtenerProximoCierre(tarjeta);
                const proximoVencimiento = obtenerProximoVencimiento(tarjeta);

                // Determinar el color del borde según los días restantes
                let borderColor = 'border-green-500'; // Más de 3 días
                let bgColor = 'bg-green-500/10';
                
                if (dias <= 0) {
                  borderColor = 'border-red-500'; // Vencido o vence hoy
                  bgColor = 'bg-red-500/10';
                } else if (dias >= 1 && dias <= 3) {
                  borderColor = 'border-yellow-500'; // Entre 1 y 3 días
                  bgColor = 'bg-yellow-500/10';
                }

                return (
                  <div
                    key={tarjeta.id}
                    className="rounded-lg p-3 text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: tarjeta.color }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1 truncate">{tarjeta.nombre}</h3>
                        <div className="flex items-center gap-3 text-xs opacity-90">
                          <span>Cierre: {proximoCierre.dia}/{proximoCierre.mes.toString().padStart(2, '0')}</span>
                          <span>•</span>
                          <span>Venc: {proximoVencimiento.dia}/{proximoVencimiento.mes.toString().padStart(2, '0')}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className={`text-xs font-semibold px-2 py-1 rounded border-2 ${borderColor} ${bgColor}`}>
                          {dias <= 0 ? '🔴 ' : dias <= 3 ? '⚠️ ' : ''}
                          {dias <= 0 ? (dias === 0 ? 'Vence hoy' : 'Vencida') : dias === 1 ? 'Mañana' : `${dias} días`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={onAddGasto}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-30"
          title="Agregar gasto"
        >
          <Plus className="w-7 h-7 sm:w-8 sm:h-8" />
        </button>
      </div>
    </div>
  );
}
