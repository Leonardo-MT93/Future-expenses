import { useState } from 'react';
import { Home, DollarSign, Banknote, CreditCard } from 'lucide-react';
import { Gasto } from './lib/db';
import { useAuth } from './contexts/AuthContext';
import { agregarGasto, editarGasto, eliminarGasto } from './utils/gastos';
import { GoogleAuth } from './components/GoogleAuth';
import { Dashboard } from './pages/Dashboard';
import { GastosLista } from './pages/GastosLista';
import { Tarjetas } from './pages/Tarjetas';
import { GastoModal } from './components/GastoModal';
import { ConfirmModal } from './components/ConfirmModal';
import { Toast } from './components/Toast';

type Tab = 'home' | 'ars' | 'usd' | 'tarjetas';

type ToastState = {
  message: string;
  type: 'success' | 'error' | 'info';
} | null;

function App() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gastoEditando, setGastoEditando] = useState<Gasto | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddGasto = () => {
    setGastoEditando(null);
    setIsModalOpen(true);
  };

  const handleEditGasto = (gasto: Gasto) => {
    setGastoEditando(gasto);
    setIsModalOpen(true);
  };

  const handleSaveGasto = async (gastoData: any) => {
    if (!user) return;
    
    try {
      if (gastoEditando) {
        await editarGasto(gastoEditando.id, gastoData);
        setToast({ message: 'Gasto actualizado', type: 'info' });
      } else {
        await agregarGasto(user.id, gastoData);
        setToast({ message: 'Gasto agregado exitosamente', type: 'success' });
      }
      setIsModalOpen(false);
      setGastoEditando(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      setToast({ message: 'Error al guardar el gasto', type: 'error' });
    }
  };

  const handleDeleteGasto = async (id: string) => {
    setConfirmDelete(id);
  };

  const confirmDeleteGasto = async () => {
    if (confirmDelete) {
      const success = await eliminarGasto(confirmDelete);
      if (success) {
        setToast({ message: 'Gasto eliminado', type: 'error' });
        setRefreshTrigger(prev => prev + 1);
        setIsModalOpen(false);
      } else {
        setToast({ message: 'Error al eliminar el gasto', type: 'error' });
      }
      setConfirmDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-300">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <GoogleAuth />;
  }

  const tabs = [
    { id: 'home' as Tab, label: 'Home', icon: Home },
    { id: 'ars' as Tab, label: 'Gastos ARS', icon: DollarSign },
    { id: 'usd' as Tab, label: 'Gastos USD', icon: Banknote },
    { id: 'tarjetas' as Tab, label: 'Tarjetas', icon: CreditCard },
  ];

  const handleTarjetaChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 shadow-lg sticky top-0 z-40 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex justify-around sm:justify-start sm:space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 px-3 sm:px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  title={tab.label}
                >
                  <Icon className="w-5 h-5 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline text-sm md:text-base">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main>
        {activeTab === 'home' && (
          <Dashboard
            onAddGasto={handleAddGasto}
            onNavigateToTarjetas={() => setActiveTab('tarjetas')}
            refreshTrigger={refreshTrigger}
          />
        )}
        {activeTab === 'ars' && (
          <GastosLista
            moneda="ARS"
            onAddGasto={handleAddGasto}
            onEditGasto={handleEditGasto}
            onDeleteGasto={handleDeleteGasto}
            refreshTrigger={refreshTrigger}
          />
        )}
        {activeTab === 'usd' && (
          <GastosLista
            moneda="USD"
            onAddGasto={handleAddGasto}
            onEditGasto={handleEditGasto}
            onDeleteGasto={handleDeleteGasto}
            refreshTrigger={refreshTrigger}
          />
        )}
        {activeTab === 'tarjetas' && (
          <Tarjetas
            onTarjetaChange={handleTarjetaChange}
            refreshTrigger={refreshTrigger}
          />
        )}
      </main>

      <GastoModal
        isOpen={isModalOpen}
        gasto={gastoEditando}
        onClose={() => {
          setIsModalOpen(false);
          setGastoEditando(null);
        }}
        onSave={handleSaveGasto}
        onDelete={handleDeleteGasto}
      />

      <ConfirmModal
        isOpen={confirmDelete !== null}
        title="¿Estás seguro?"
        message="¿Estás seguro de eliminar este gasto? Esta acción no se puede deshacer."
        onConfirm={confirmDeleteGasto}
        onCancel={() => setConfirmDelete(null)}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
