# 🔧 Configuración Completa - Guía Paso a Paso

Esta guía te llevará desde cero hasta tener tu aplicación funcionando.

---

## 📦 Paso 1: Instalar Dependencias

```bash
npm install
```

✅ **Verificación**: Deberías ver el mensaje "added X packages" sin errores.

---

## 🗄️ Paso 2: Configurar Base de Datos (Neon)

### Opción A: Ejecutar archivo combinado (Más fácil ✨)

1. Abre la consola web de Neon: [https://console.neon.tech/](https://console.neon.tech/)
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Abre el archivo `supabase/migrations/00_run_all_migrations.sql`
5. Copia TODO el contenido
6. Pégalo en el editor de Neon
7. Haz clic en **Run**

✅ **Verificación**: Deberías ver el mensaje "Query completed successfully" y las 3 tablas creadas.

### Opción B: Usar psql desde terminal

```bash
# Conectar a Neon
psql 'postgresql://TU_USUARIO:TU_PASSWORD@TU_HOST.neon.tech/TU_DATABASE?sslmode=require'

# Una vez conectado, ejecuta:
\i supabase/migrations/00_run_all_migrations.sql

# O ejecuta cada migración por separado:
\i supabase/migrations/20251016000001_create_users_table.sql
\i supabase/migrations/20251016000002_create_tarjetas_table.sql
\i supabase/migrations/20251007100945_create_gastos_table.sql
\i supabase/migrations/20251016000003_add_tarjeta_id_to_gastos.sql
\i supabase/migrations/20251016000004_update_gastos_user_reference.sql

# Salir
\q
```

✅ **Verificación**: Ejecuta `\dt` en psql para ver las tablas: `users`, `tarjetas`, `gastos`.

---

## 🔐 Paso 3: Configurar Google OAuth

### 3.1 Crear Credenciales

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. **Crear/Seleccionar proyecto**:
   - Clic en el dropdown de proyectos (arriba izquierda)
   - "New Project"
   - Nombre: "Gestor de Gastos" (o el que prefieras)
   - Clic en "Create"

3. **Habilitar la API**:
   - En el menú lateral: **APIs & Services** > **Library**
   - Busca "Google+ API"
   - Clic en "Enable"

4. **Crear Credenciales OAuth**:
   - Ve a **APIs & Services** > **Credentials**
   - Clic en **+ Create Credentials** > **OAuth client ID**
   
5. **Configurar pantalla de consentimiento** (si es la primera vez):
   - User Type: **External**
   - App name: "Gestor de Gastos"
   - User support email: tu email
   - Developer contact: tu email
   - Clic en "Save and Continue" hasta terminar

6. **Crear OAuth Client ID**:
   - Application type: **Web application**
   - Name: "Gestor de Gastos Web"
   - **Authorized JavaScript origins**:
     ```
     http://localhost:5173
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:5173
     ```
   - Clic en **Create**

7. **Copiar Client ID**:
   - Aparecerá un modal con tu Client ID y Client Secret
   - **COPIA EL CLIENT ID** (algo como `123456789-abc.apps.googleusercontent.com`)
   - No necesitas el Client Secret

✅ **Verificación**: Deberías tener un Client ID de aproximadamente 80 caracteres.

---

## 🔑 Paso 4: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (mismo nivel que `package.json`):

```env
# Neon PostgreSQL Database
VITE_DATABASE_URL=postgresql://TU_USUARIO:TU_PASSWORD@TU_HOST.neon.tech/TU_DATABASE?sslmode=require

# Google OAuth - PEGA TU CLIENT ID AQUÍ
VITE_GOOGLE_CLIENT_ID=TU_CLIENT_ID_DE_GOOGLE_AQUI
```

⚠️ **IMPORTANTE**: 
- Reemplaza `TU_CLIENT_ID_DE_GOOGLE_AQUI` con el Client ID que copiaste
- NO uses comillas en los valores
- NO compartas este archivo (está en `.gitignore`)

✅ **Verificación**: El archivo `.env` existe y tiene las 2 variables configuradas.

---

## 🚀 Paso 5: Iniciar la Aplicación

```bash
npm run dev
```

Deberías ver algo como:

```
  VITE v5.4.2  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Abre tu navegador en [http://localhost:5173](http://localhost:5173)

✅ **Verificación**: Ves la pantalla de login con el botón "Continue with Google".

---

## 🎉 Paso 6: Primer Uso

### 6.1 Iniciar Sesión
1. Clic en **"Continue with Google"**
2. Selecciona tu cuenta de Google
3. Autoriza los permisos

✅ **Verificación**: Entras al dashboard de la aplicación.

### 6.2 Agregar tu primera tarjeta
1. Ve a la pestaña **"Tarjetas"**
2. Clic en **"Agregar Tarjeta"**
3. Completa:
   - **Nombre**: Ej: "Visa Personal"
   - **Día de cierre**: Ej: 15
   - **Día de vencimiento**: Ej: 10
   - **Color**: Elige uno
4. Clic en **"Guardar"**

✅ **Verificación**: La tarjeta aparece en la lista.

### 6.3 Agregar tu primer gasto
1. Clic en el botón **"+"** (flotante, abajo a la derecha)
2. Completa:
   - **Moneda**: ARS o USD
   - **Descripción**: Ej: "Netflix"
   - **Monto**: Ej: 5000
   - **Categoría**: "Suscripciones"
   - **Tipo de Gasto**: "Pago recurrente mensual"
   - **Tarjeta**: Selecciona la que creaste
   - **Activo**: ✅ (marcado)
3. Clic en **"Guardar"**

✅ **Verificación**: El gasto aparece en la lista y en el dashboard.

---

## 📊 Funcionalidades

### Tipos de Gastos

#### 1. Pago Único
- **NO requiere tarjeta**
- Ejemplo: Impuesto anual, regalo
- Campos: Descripción, Monto, Mes de pago

#### 2. Pago en Cuotas
- **Requiere tarjeta** ⚠️
- Ejemplo: Celular en 12 cuotas
- Campos: Monto total, Cuota actual, Total cuotas, Mes inicio

#### 3. Pago Recurrente (Suscripción)
- **Requiere tarjeta** ⚠️
- Ejemplo: Netflix, Spotify
- Campos: Monto, Activo/Inactivo

### Dashboard
- Total a pagar próximo mes en ARS
- Total a pagar próximo mes en USD
- Vista de tarjetas con días de vencimiento

### Filtros y Ordenamiento
- Por categoría
- Por fecha
- Por monto
- Por próximo pago

---

## ❌ Solución de Problemas

### Error: "VITE_GOOGLE_CLIENT_ID no está definido"
**Solución**:
1. Verifica que el archivo `.env` existe
2. Asegúrate de que la variable esté escrita correctamente
3. Reinicia el servidor: `Ctrl+C` y luego `npm run dev`

### No puedo iniciar sesión con Google
**Solución**:
1. Verifica que el Client ID en `.env` sea correcto
2. Asegúrate de haber agregado `http://localhost:5173` en Google Console
3. Abre el navegador en modo incógnito e intenta de nuevo
4. Revisa la consola del navegador (F12) para ver errores

### Error de base de datos al cargar datos
**Solución**:
1. Verifica que las migraciones se ejecutaron correctamente
2. Conéctate a Neon y ejecuta: `SELECT * FROM users;`
3. Si la tabla no existe, ejecuta el archivo `00_run_all_migrations.sql`

### No puedo agregar gastos en cuotas
**Solución**:
- Debes agregar al menos una tarjeta primero
- Los gastos en cuotas y recurrentes requieren una tarjeta asociada

### La aplicación no carga / pantalla en blanco
**Solución**:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console" para ver errores
3. Verifica que todas las variables de entorno estén configuradas
4. Borra el localStorage: En la consola ejecuta `localStorage.clear()`

---

## 🔒 Seguridad

- Las credenciales están en `.env` y NO se suben a Git
- La base de datos usa conexión SSL
- Google OAuth maneja la autenticación de forma segura
- Los datos están aislados por usuario

---

## 📝 Scripts Disponibles

```bash
npm run dev        # Iniciar en modo desarrollo
npm run build      # Compilar para producción
npm run preview    # Vista previa de la build
npm run lint       # Revisar errores de código
npm run typecheck  # Verificar tipos de TypeScript
```

---

## 🎯 Próximos Pasos

Una vez que tengas todo funcionando:

1. ✅ Agrega todas tus tarjetas
2. ✅ Registra tus gastos recurrentes (suscripciones)
3. ✅ Añade gastos en cuotas existentes
4. ✅ Explora el dashboard para ver tus totales
5. ✅ Usa filtros para organizar tus gastos

---

## 📞 ¿Sigues teniendo problemas?

Si después de seguir esta guía sigues teniendo problemas:

1. Revisa que hayas completado TODOS los pasos
2. Verifica la consola del navegador (F12)
3. Verifica la terminal donde corre `npm run dev`
4. Intenta en modo incógnito del navegador

---

¡Todo listo! Disfruta gestionando tus gastos futuros. 💰✨

