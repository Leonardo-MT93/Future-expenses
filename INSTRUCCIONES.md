# 📖 Instrucciones de Configuración Rápida

## ⚡ Pasos Rápidos para Empezar

### 1️⃣ Instalar Dependencias
```bash
npm install
```

### 2️⃣ Ejecutar Migraciones en Neon

**Opción A: Usar psql (Recomendado)**

Conecta a tu base de datos:
```bash
psql 'postgresql://TU_USUARIO:TU_PASSWORD@TU_HOST.neon.tech/TU_DATABASE?sslmode=require'
```

Ejecuta los archivos de migración:
```sql
\i supabase/migrations/20251016000001_create_users_table.sql
\i supabase/migrations/20251016000002_create_tarjetas_table.sql
\i supabase/migrations/20251007100945_create_gastos_table.sql
\i supabase/migrations/20251016000003_add_tarjeta_id_to_gastos.sql
\i supabase/migrations/20251016000004_update_gastos_user_reference.sql
```

**Opción B: Usar la consola web de Neon**

1. Ve a [https://console.neon.tech/](https://console.neon.tech/)
2. Abre tu proyecto
3. Ve a **SQL Editor**
4. Copia y pega el contenido de cada archivo SQL (en orden)
5. Ejecuta cada uno

### 3️⃣ Configurar Google OAuth

1. Entra a: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Crea un proyecto nuevo o usa uno existente
3. Habilita la **Google+ API**
4. Ve a **APIs & Services** > **Credentials**
5. Clic en **Create Credentials** > **OAuth client ID**
6. Configuración:
   ```
   Application type: Web application
   Name: Gestor de Gastos
   Authorized redirect URIs: http://localhost:5173
   Authorized JavaScript origins: http://localhost:5173
   ```
7. Copia el **Client ID** (algo como: `123456789-abc.apps.googleusercontent.com`)

### 4️⃣ Crear archivo .env

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_DATABASE_URL=postgresql://TU_USUARIO:TU_PASSWORD@TU_HOST.neon.tech/TU_DATABASE?sslmode=require

VITE_GOOGLE_CLIENT_ID=PEGA_AQUI_TU_CLIENT_ID
```

⚠️ **IMPORTANTE**: Reemplaza `PEGA_AQUI_TU_CLIENT_ID` con el Client ID de Google.

### 5️⃣ Iniciar la Aplicación

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## ✅ Checklist de Verificación

- [ ] `npm install` ejecutado
- [ ] 5 migraciones SQL ejecutadas en Neon
- [ ] Client ID de Google creado
- [ ] Archivo `.env` creado con las dos variables
- [ ] Servidor corriendo en `http://localhost:5173`
- [ ] Puedes ver el botón de "Continue with Google"

---

## 🎯 Primer Uso

1. **Login**: Haz clic en "Continue with Google"
2. **Agregar tarjeta**: Ve a la pestaña "Tarjetas" y agrega tu primera tarjeta
3. **Agregar gasto**: Usa el botón flotante "+" en la esquina inferior derecha
4. **Dashboard**: Verás los totales del próximo mes en el Home

---

## ❓ Problemas Comunes

### No puedo iniciar sesión con Google
- Verifica que el `VITE_GOOGLE_CLIENT_ID` esté correctamente configurado en `.env`
- Asegúrate de haber agregado `http://localhost:5173` como URI de redirección autorizado en Google Cloud Console
- Reinicia el servidor de desarrollo

### Error de base de datos
- Verifica que las 5 migraciones se hayan ejecutado correctamente
- Comprueba que la URL de conexión en `.env` esté completa y correcta
- Intenta conectarte manualmente con psql para verificar la conexión

### No puedo agregar gastos en cuotas
- Primero debes agregar al menos una tarjeta de crédito
- Los gastos en cuotas y recurrentes requieren una tarjeta asociada

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas:
1. Verifica el checklist de arriba
2. Revisa la consola del navegador (F12) para ver errores
3. Verifica que todas las variables de entorno estén configuradas
4. Asegúrate de haber ejecutado todas las migraciones

---

¡Listo! Tu aplicación debería estar funcionando. 🎉

