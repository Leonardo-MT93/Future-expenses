import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { createOrUpdateUser } from '../lib/auth';
import { useAuth } from '../contexts/AuthContext';

type GoogleJWT = {
  sub: string;
  email: string;
  name: string;
  picture?: string;
};

export function GoogleAuth() {
  const { setUser } = useAuth();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error('No se recibió credencial de Google');
      }

      // Decodificar el JWT de Google
      const decoded = jwtDecode<GoogleJWT>(credentialResponse.credential);

      // Crear o actualizar usuario en la base de datos
      const user = await createOrUpdateUser({
        sub: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      });

      // Guardar usuario en el contexto
      setUser(user);
    } catch (error) {
      console.error('Error al procesar login de Google:', error);
      alert('Error al iniciar sesión. Por favor, intenta nuevamente.');
    }
  };

  const handleError = () => {
    console.error('Error en Google Login');
    alert('Error al iniciar sesión con Google');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            💰 Gestor de Gastos
          </h1>
          <p className="text-gray-400">
            Controla tus gastos futuros de manera inteligente
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-750 border border-gray-600 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Características
            </h2>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Gestión de gastos en ARS y USD
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Control de tarjetas de crédito
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Pagos únicos, en cuotas y recurrentes
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Vista de gastos del próximo mes
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-gray-400">
              Inicia sesión con tu cuenta de Google
            </p>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              theme="filled_black"
              size="large"
              text="continue_with"
              locale="es"
            />
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          Al iniciar sesión, aceptas nuestros términos de servicio
        </div>
      </div>
    </div>
  );
}

