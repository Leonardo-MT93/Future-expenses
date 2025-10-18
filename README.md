# 💰 Gestor de Gastos Futuros

Una aplicación moderna para gestionar tus gastos futuros, con soporte para múltiples monedas, tarjetas de crédito y tipos de pago.

## 🚀 Características

- ✅ Autenticación con Google OAuth
- ✅ Gestión de gastos en ARS y USD
- ✅ Tres tipos de gastos:
  - **Pago único**: Gastos que se pagan una sola vez
  - **Pago en cuotas**: Gastos divididos en múltiples pagos mensuales
  - **Pago recurrente**: Suscripciones mensuales (Netflix, Spotify, etc.)
- ✅ Gestión de tarjetas de crédito
- ✅ Vista del dashboard con totales del próximo mes
- ✅ Filtros y ordenamiento de gastos
- ✅ Base de datos PostgreSQL con Neon
- ✅ Tema oscuro moderno

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Una cuenta de Google Cloud Console
- Una cuenta de Neon Database (ya configurada)

## 🔧 Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Ejecutar Migraciones en Neon

Necesitas ejecutar las migraciones SQL en tu base de datos Neon. Conéctate a tu base de datos usando el comando que te proporcionaron:

```bash
psql 'postgresql://neondb_owner:npg_b15YLKcRTEIi@ep-square-union-adc0vqwj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
```

Luego ejecuta los archivos de migración en este orden:

```sql
\i supabase/migrations/20251016000001_create_users_table.sql
\i supabase/migrations/20251016000002_create_tarjetas_table.sql
\i supabase/migrations/20251007100945_create_gastos_table.sql
\i supabase/migrations/20251016000003_add_tarjeta_id_to_gastos.sql
\i supabase/migrations/20251016000004_update_gastos_user_reference.sql
```

O si prefieres, copia y pega el contenido de cada archivo SQL manualmente en la consola de Neon.

### 3. Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google+ API**
4. Ve a **Credenciales** > **Crear credenciales** > **ID de cliente de OAuth 2.0**
5. Configura:
   - **Tipo de aplicación**: Aplicación web
   - **Nombre**: Gestor de Gastos (o el que prefieras)
   - **URIs de redirección autorizados**: 
     - `http://localhost:5173` (para desarrollo)
     - Tu dominio de producción cuando lo despliegues
   - **Orígenes de JavaScript autorizados**:
     - `http://localhost:5173`
6. Copia el **Client ID** que se genera

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (copia desde `.env.example`):

```env
# Neon PostgreSQL Database
VITE_DATABASE_URL=postgresql://neondb_owner:npg_b15YLKcRTEIi@ep-square-union-adc0vqwj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Google OAuth
VITE_GOOGLE_CLIENT_ID=tu_google_client_id_aqui
```

⚠️ **IMPORTANTE**: Reemplaza `tu_google_client_id_aqui` con el Client ID que obtuviste en el paso anterior.

## 🎯 Ejecutar la Aplicación

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build para Producción

```bash
npm run build
npm run preview
```

## 📱 Uso de la Aplicación

### 1. Iniciar Sesión
- Al abrir la aplicación, haz clic en "Continue with Google"
- Autoriza el acceso con tu cuenta de Google

### 2. Agregar Tarjetas
- Ve a la pestaña **Tarjetas**
- Haz clic en **Agregar Tarjeta**
- Completa:
  - Nombre de la tarjeta
  - Día de cierre (1-31)
  - Día de vencimiento (1-31)
  - Color para identificarla

### 3. Agregar Gastos

#### Gasto Único
- No requiere tarjeta
- Selecciona el mes en que pagarás
- Ejemplo: Impuesto anual, regalo, etc.

#### Gasto en Cuotas
- **Requiere seleccionar una tarjeta**
- Ingresa:
  - Monto total
  - Cuota actual (ej: 3)
  - Total de cuotas (ej: 12)
  - Mes de la primera cuota
- Ejemplo: Compra de celular en 12 cuotas

#### Gasto Recurrente (Suscripción)
- **Requiere seleccionar una tarjeta**
- Marca como "Activo" si aún está vigente
- Ejemplo: Netflix, Spotify, gym, etc.

### 4. Dashboard
- Visualiza el total a pagar el próximo mes en ARS y USD
- Ve un resumen de tus tarjetas y sus vencimientos

## 🗂️ Estructura del Proyecto

```
project/
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── GoogleAuth.tsx # Componente de autenticación
│   │   ├── GastoModal.tsx # Modal para agregar/editar gastos
│   │   ├── TarjetaModal.tsx
│   │   └── ...
│   ├── contexts/         # Contextos de React
│   │   └── AuthContext.tsx
│   ├── lib/              # Configuración de librerías
│   │   ├── db.ts         # Cliente de Neon PostgreSQL
│   │   └── auth.ts       # Funciones de autenticación
│   ├── pages/            # Páginas principales
│   │   ├── Dashboard.tsx
│   │   ├── GastosLista.tsx
│   │   └── Tarjetas.tsx
│   ├── utils/            # Funciones utilitarias
│   │   ├── gastos.ts
│   │   └── tarjetas.ts
│   └── App.tsx           # Componente principal
├── supabase/
│   └── migrations/       # Migraciones SQL
└── package.json

```

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS
- **Base de Datos**: Neon PostgreSQL
- **Autenticación**: Google OAuth 2.0 (@react-oauth/google)
- **Iconos**: Lucide React

## 🐛 Solución de Problemas

### Error: "VITE_GOOGLE_CLIENT_ID no está definido"
- Asegúrate de haber creado el archivo `.env`
- Verifica que el Client ID esté correctamente configurado
- Reinicia el servidor de desarrollo después de cambiar el `.env`

### Error al conectar a la base de datos
- Verifica que la cadena de conexión en `.env` sea correcta
- Asegúrate de que las migraciones se hayan ejecutado correctamente
- Verifica tu conexión a internet (Neon requiere conexión)

### No puedo agregar gastos en cuotas
- Primero debes agregar una tarjeta de crédito
- Los gastos en cuotas y recurrentes requieren una tarjeta asociada

## 📝 Notas Importantes

- La aplicación almacena el usuario en `localStorage` para mantener la sesión
- Las tarjetas se asocian automáticamente con tu cuenta de Google
- Los gastos únicos NO requieren tarjeta (solo los de cuotas y recurrentes)
- El dashboard muestra solo los gastos del próximo mes

## 🚀 Próximas Mejoras

- [ ] Notificaciones de vencimientos
- [ ] Gráficos de gastos
- [ ] Exportar datos a Excel/CSV
- [ ] Vista de calendario
- [ ] Historial de pagos

## 📄 Licencia

Este proyecto es privado y de uso personal.

---

Desarrollado con ❤️ usando React + Neon + Google OAuth

