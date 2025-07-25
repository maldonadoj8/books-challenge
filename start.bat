@echo off
REM Script para iniciar backend y frontend en modo desarrollo (Windows)


REM Inicia el backend
cd backend
if exist package.json (
  echo Instalando dependencias del backend...
  call npm install
  REM Inicializa la base de datos si existe el script
  if exist scripts\init-db.js (
    echo Inicializando base de datos...
    call node scripts\init-db.js
  )
  echo Iniciando backend...
  start cmd /c "npm start"
) else (
  echo No se encontro package.json en backend.
)
cd ..

REM Inicia el frontend
cd frontend
if exist package.json (
  echo Instalando dependencias del frontend...
  call npm install
  echo Iniciando frontend...
  start cmd /c "npm run dev"
) else (
  echo No se encontro package.json en frontend.
)
cd ..

REM Espera a que el usuario cierre las ventanas manualmente
pause
