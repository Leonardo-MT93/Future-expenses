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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">{titulo}</h1>

        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <label className="text-sm font-medium text-gray-300">Categoría:</label>
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Todas">Todas</option>
                {CATEGORIAS.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-300">Ordenar por:</label>
              <select
                value={ordenCriterio}
                onChange={(e) => setOrdenCriterio(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="fecha">Fecha de creación</option>
                <option value="monto_desc">Monto mayor a menor</option>
                <option value="monto_asc">Monto menor a mayor</option>
                <option value="proximo_pago">Próximo pago</option>
              </select>
            </div>

            <div className="ml-auto text-sm font-medium text-gray-300">
              Total: {gastosOrdenados.length} {gastosOrdenados.length === 1 ? 'gasto' : 'gastos'}
            </div>
          </div>
        </div>

        {gastosOrdenados.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-600 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">
              No tienes gastos registrados {moneda === 'ARS' ? 'en pesos' : 'en dólares'}
            </h3>
            <p className="text-gray-400 mb-6">
              Comienza agregando tu primer gasto para llevar un control de tus finanzas
            </p>
            <button
              onClick={onAddGasto}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Agregar Gasto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
