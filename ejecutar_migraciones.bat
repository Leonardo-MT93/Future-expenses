@echo off
echo ========================================
echo Ejecutando migraciones en Neon...
echo ========================================
echo.

psql "postgresql://neondb_owner:npg_b15YLKcRTEIi@ep-square-union-adc0vqwj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" -f supabase/migrations/00_run_all_migrations.sql

echo.
echo ========================================
echo Migraciones ejecutadas!
echo ========================================
echo.
echo Verifica que se hayan creado las tablas:
psql "postgresql://neondb_owner:npg_b15YLKcRTEIi@ep-square-union-adc0vqwj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" -c "\dt"

pause

