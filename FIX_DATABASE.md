# 🔧 Solución: Tabla "users" no existe

## El Problema

El error `relation "users" does not exist` significa que las migraciones SQL **no se ejecutaron** en tu base de datos Neon.

---

## ✅ Solución Paso a Paso

### Opción 1: Ejecutar desde la Consola Web de Neon (MÁS FÁCIL) ⭐

1. **Abre tu proyecto en Neon:**
   - Ve a: https://console.neon.tech/
   - Inicia sesión
   - Selecciona tu proyecto

2. **Abre el SQL Editor:**
   - En el menú lateral, busca **"SQL Editor"** o **"Query"**
   - Haz clic para abrir el editor

3. **Copia y pega este SQL:**
   - Abre el archivo: `supabase/migrations/00_run_all_migrations.sql`
   - Copia TODO el contenido (Ctrl+A, Ctrl+C)
   - Pégalo en el editor de Neon

4. **Ejecuta el script:**
   - Haz clic en el botón **"Run"** o presiona **Ctrl+Enter**
   - Espera a que termine (debería tomar 1-2 segundos)

5. **Verifica que funcionó:**
   - Ejecuta este query en el mismo editor:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
   - Deberías ver 3 tablas: `users`, `tarjetas`, `gastos`

---

### Opción 2: Usar psql desde la Terminal

```bash
# Conectar a Neon
psql 'postgresql://TU_USUARIO:TU_PASSWORD@TU_HOST.neon.tech/TU_DATABASE?sslmode=require'

# Una vez conectado, ejecuta:
\i supabase/migrations/00_run_all_migrations.sql

# Verifica las tablas:
\dt

# Deberías ver:
# Schema | Name      | Type  | Owner
# --------+-----------+-------+-------
# public | users     | table | ...
# public | tarjetas  | table | ...
# public | gastos    | table | ...

# Salir
\q
```

---

## 🔍 Verificar que las Tablas Existen

Después de ejecutar las migraciones, verifica ejecutando este SQL en Neon:

```sql
-- Ver todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Ver estructura de la tabla users
\d users

-- O con SQL estándar:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users';
```

Deberías ver:
- ✅ Tabla `users` con columnas: id, email, name, google_id, picture, fecha_creacion, ultima_sesion
- ✅ Tabla `tarjetas` con columnas: id, nombre, dia_cierre, dia_vencimiento, color, etc.
- ✅ Tabla `gastos` con columnas: id, descripcion, moneda, monto, categoria, tipo, tarjeta_id, etc.

---

## 🔄 Después de Ejecutar las Migraciones

1. **Reinicia el servidor de desarrollo:**
   ```bash
   # Presiona Ctrl+C en la terminal donde corre el servidor
   # Luego ejecuta de nuevo:
   npm run dev
   ```

2. **Abre la aplicación:**
   - Ve a: http://localhost:5173
   - Intenta iniciar sesión con Google

3. **Debería funcionar:**
   - El login con Google debería crear tu usuario en la tabla `users`
   - Deberías ver el dashboard

---

## ❌ Si Sigues Teniendo Errores

### Error: "permission denied for table users"
**Solución:** Tu usuario de Neon no tiene permisos. Ejecuta:
```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO neondb_owner;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO neondb_owner;
```

### Error: "database does not exist"
**Solución:** Verifica que estés conectado a la base de datos correcta:
```sql
-- Ver base de datos actual
SELECT current_database();

-- Debería mostrar: neondb
```

### Error: "connection refused"
**Solución:** Verifica tu variable de entorno:
```bash
# En la terminal:
echo $VITE_DATABASE_URL

# O en PowerShell:
echo $env:VITE_DATABASE_URL
```

---

## 🎯 Checklist Final

- [ ] Migraciones ejecutadas en Neon
- [ ] Comando `\dt` muestra 3 tablas (users, tarjetas, gastos)
- [ ] Servidor reiniciado con `npm run dev`
- [ ] Login con Google funciona sin errores
- [ ] Consola del navegador sin errores de "relation users does not exist"

---

## 📞 Debugging Adicional

Si después de ejecutar las migraciones sigue sin funcionar, verifica:

1. **Que estés usando la base de datos correcta:**
   ```sql
   SELECT current_database();
   -- Debe ser: neondb
   ```

2. **Que las tablas tengan datos después del login:**
   ```sql
   SELECT * FROM users;
   -- Después del primer login, debería haber 1 registro
   ```

3. **Revisa los logs de Neon:**
   - En la consola de Neon, ve a "Monitoring" o "Logs"
   - Busca errores relacionados con las migraciones

---

¡Ejecuta las migraciones y avísame si funciona! 🚀

