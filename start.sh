#!/bin/bash
# Script para iniciar backend y frontend en modo desarrollo


# Inicia el backend
cd backend
if [ -f package.json ]; then
  echo "Instalando dependencias del backend..."
  npm install
  # Inicializa la base de datos si existe el script
  if [ -f scripts/init-db.js ]; then
    echo "Inicializando base de datos..."
    node scripts/init-db.js
  fi
  echo "Iniciando backend..."
  npm start &
else
  echo "No se encontró package.json en backend."
fi
cd ..

# Inicia el frontend
cd frontend
if [ -f package.json ]; then
  echo "Instalando dependencias del frontend..."
  npm install
  echo "Iniciando frontend..."
  npm run dev &
else
  echo "No se encontró package.json en frontend."
fi
cd ..

wait