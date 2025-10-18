import { useEffect, useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Gasto } from '../lib/db';
import { obtenerGastos, ordenarGastos, filtrarPorCategoria, CATEGORIAS } from '../utils/gastos';
import { GastoCard } from '../components/GastoCard';
import { useAuth } from '../contexts/AuthContext';

type GastosListaProps = {
  moneda: 'ARS' | 'USD';
  onAddGasto: () => void;
  onEditGasto: (gasto: Gasto) => void;
  onDeleteGasto: (id: string) => void;
  refreshTrigger: number;
};

export function GastosLista({ moneda, onAddGasto, onEditGasto, onDeleteGasto, refreshTrigger }: GastosListaProps) {
  const { user } = useAuth();
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [ordenCriterio, setOrdenCriterio] = useState('fecha');

  useEffect(() => {
    const cargarGastos = async () => {
      if (!user) return;
      const data = await obtenerGastos(user.id, moneda);
      setGastos(data);
    };

    cargarGastos();
  }, [moneda, refreshTrigger, user]);

  const gastosFiltrados = filtrarPorCategoria(gastos, categoriaFiltro);
  const gastosOrdenados = ordenarGastos(gastosFiltrados, ordenCriterio);

  const titulo = moneda === 'ARS' ? 'Gastos en Pesos Argentinos' : 'Gastos en Dólares';

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">{titulo}</h1>

        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
              <label className="text-xs sm:text-sm font-medium text-gray-300 hidden sm:inline">Categoría:</label>
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="flex-1 sm:flex-none px-2 sm:px-3 py-2 text-xs sm:text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Todas">Todas</option>
                {CATEGORIAS.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 flex-1">
              <label className="text-xs sm:text-sm font-medium text-gray-300 hidden sm:inline whitespace-nowrap">Ordenar:</label>
              <select
                value={ordenCriterio}
                onChange={(e) => setOrdenCriterio(e.target.value)}
                className="flex-1 sm:flex-none px-2 sm:px-3 py-2 text-xs sm:text-sm bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="fecha">Fecha de creación</option>
                <option value="monto_desc">Mayor a menor</option>
                <option value="monto_asc">Menor a mayor</option>
                <option value="proximo_pago">Próximo pago</option>
              </select>
            </div>

            <div className="text-xs sm:text-sm font-medium text-gray-300 text-center sm:text-left">
              Total: {gastosOrdenados.length} {gastosOrdenados.length === 1 ? 'gasto' : 'gastos'}
            </div>
          </div>
        </div>

        {gastosOrdenados.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-8 sm:p-12 text-center">
            <div className="text-gray-600 mb-4">
              <svg className="w-16 h-16 sm:w-24 sm:h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-200 mb-2">
              No tienes gastos registrados {moneda === 'ARS' ? 'en pesos' : 'en dólares'}
            </h3>
            <p className="text-sm sm:text-base text-gray-400 mb-6">
              Comienza agregando tu primer gasto para llevar un control de tus finanzas
            </p>
            <button
              onClick={onAddGasto}
              className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Agregar Gasto
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {gastosOrdenados.map((gasto) => (
              <GastoCard
                key={gasto.id}
                gasto={gasto}
                onEdit={onEditGasto}
                onDelete={onDeleteGasto}
              />
            ))}
          </div>
        )}

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
