REM filepath: c:\Users\Sergio\Desktop\Poryecto Octavio-Sergio\Login Laravel\iniciar.bat
@echo off
echo Iniciando la aplicacion de Login...
echo.

REM Verificar si existe la carpeta css en public
if not exist "C:\Users\Sergio\Desktop\Poryecto Octavio-Sergio\Login Laravel\frontend\public\css" (
  echo Creando carpeta para estilos CSS...
  mkdir "C:\Users\Sergio\Desktop\Poryecto Octavio-Sergio\Login Laravel\frontend\public\css"
)

REM Verificar si existe la carpeta public
if not exist "C:\Users\Sergio\Desktop\Poryecto Octavio-Sergio\Login Laravel\frontend\public" (
  echo Creando carpeta public...
  mkdir "C:\Users\Sergio\Desktop\Poryecto Octavio-Sergio\Login Laravel\frontend\public"
)

REM Verificar si existe la carpeta views
if not exist "C:\Users\Sergio\Desktop\Poryecto Octavio-Sergio\Login Laravel\frontend\views" (
  echo Creando carpeta views...
  mkdir "C:\Users\Sergio\Desktop\Poryecto Octavio-Sergio\Login Laravel\frontend\views"
)

echo Abriendo dos ventanas de comandos: Laravel y Node.js
echo.

start cmd /k "cd /d C:\Users\Sergio\Desktop\Poryecto Octavio-Sergio\Login Laravel && php artisan serve"
start cmd /k "cd /d C:\Users\Sergio\Desktop\Poryecto Octavio-Sergio\Login Laravel\frontend && npm start"

echo.
echo Aplicacion iniciada! Visita http://localhost:3000 en tu navegador
echo NOTA: Se ha agregado una página de índice con acceso seguro al login.