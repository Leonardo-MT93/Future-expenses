# Migración: Agregar Mes a Fechas de Tarjetas

## ¿Qué hace esta migración?

Esta migración agrega dos nuevos campos a la tabla `tarjetas`:
- `mes_cierre`: El mes del año en que cierra la tarjeta (1-12)
- `mes_vencimiento`: El mes del año en que vence el pago (1-12)

Esto permite tener fechas específicas de cierre y vencimiento (día + mes) en lugar de solo el día del mes.

## ¿Por qué es importante?

Con estos campos, tu aplicación puede:
- Calcular correctamente las fechas de cierre y vencimiento anuales
- Saber exactamente cuándo vence cada tarjeta cada año
- Gestionar mejor los períodos de facturación

## Cómo ejecutar la migración

### Opción 1: Ejecutar solo la nueva migración (Para bases de datos existentes)

Si ya tienes la base de datos creada con tarjetas, ejecuta el archivo:
```sql
supabase/migrations/20251018000001_add_mes_to_tarjetas.sql
```

**Pasos:**
1. Abre tu consola de Neon PostgreSQL
2. Copia y pega todo el contenido del archivo `20251018000001_add_mes_to_tarjetas.sql`
3. Ejecuta el script

**NOTA:** Las tarjetas existentes tendrán el mes actual como valor por defecto. Deberás editarlas después para establecer el mes correcto.

### Opción 2: Crear base de datos desde cero

Si estás creando la base de datos desde cero, ejecuta:
```sql
supabase/migrations/00_run_all_migrations.sql
```

Este archivo ya incluye los nuevos campos `mes_cierre` y `mes_vencimiento`.

### Opción 3: Usar el script de Windows

Ejecuta el archivo `ejecutar_migraciones.bat` que te guiará por el proceso.

## Verificar que la migración funcionó

Ejecuta esta consulta en tu consola de Neon:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tarjetas';
```

Deberías ver las columnas:
- `dia_cierre` (integer)
- `mes_cierre` (integer)
- `dia_vencimiento` (integer)
- `mes_vencimiento` (integer)

## Después de la migración

1. Las nuevas tarjetas permitirán seleccionar mes y día tanto para cierre como para vencimiento
2. Las tarjetas existentes necesitarán ser editadas para establecer el mes correcto
3. La aplicación calculará automáticamente las próximas fechas de cierre y vencimiento basándose en estos valores

## Archivos modificados

- `supabase/migrations/20251018000001_add_mes_to_tarjetas.sql` - Nueva migración
- `supabase/migrations/00_run_all_migrations.sql` - Actualizado con los nuevos campos
- `src/lib/db.ts` - Tipo `Tarjeta` actualizado
- `src/components/TarjetaModal.tsx` - Formulario actualizado con selectores de mes
- `src/utils/tarjetas.ts` - Funciones actualizadas para usar mes específico
- `src/components/TarjetaCard.tsx` - Visualización mejorada

## Soporte

Si tienes problemas con la migración, verifica:
1. Que tengas permisos para modificar la estructura de la base de datos
2. Que no haya conflictos con datos existentes
3. Que la conexión a la base de datos sea correcta

