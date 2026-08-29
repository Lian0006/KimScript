#!/bin/bash

# Script para forzar rebuild completo sin cache
# Esto debería ayudar a reducir el tamaño del deploy

echo "🚀 Forzando rebuild completo sin cache..."

# Limpiar cache de Docker (si está disponible)
if command -v docker &> /dev/null; then
    echo "🧹 Limpiando cache de Docker..."
    docker system prune -af
    docker builder prune -af
fi

# Crear archivo de timestamp para cache bust
echo "⏰ Creando timestamp para cache bust..."
echo "# Cache bust timestamp: $(date)" > cache-bust.txt

# Forzar commit con timestamp
git add cache-bust.txt
git commit -m "force: Cache bust timestamp $(date) - Force complete rebuild

- Add timestamp file to break Docker cache layers
- Force Render to rebuild from scratch
- Expected: Significant size reduction with Alpine Linux
- Target: 300-500MB transfer (vs current 4.0GB)"

echo "✅ Cache bust implementado. Haciendo push..."
git push origin main

echo "🎯 Deploy forzado iniciado. Monitorear en Render dashboard."
