@echo off
echo ========================================
echo Ejecutando migraciones en Neon...
echo ========================================
echo.

psql "postgresql://TU_USUARIO:TU_PASSWORD@TU_HOST.neon.tech/TU_DATABASE?sslmode=require" -f supabase/migrations/00_run_all_migrations.sql

echo.
echo ========================================
echo Migraciones ejecutadas!
echo ========================================
echo.
echo Verifica que se hayan creado las tablas:
psql "postgresql://TU_USUARIO:TU_PASSWORD@TU_HOST.neon.tech/TU_DATABASE?sslmode=require" -c "\dt"

pause

