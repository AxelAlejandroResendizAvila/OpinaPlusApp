#!/bin/bash

# Script de instalación para backend ML - OpinaPlusApp
# Ejecuta: chmod +x setup.sh && ./setup.sh

echo " Configurando Backend de Machine Learning..."
echo ""

# Verificar Python
echo " Verificando Python..."
if ! command -v python3 &> /dev/null; then
    echo " Python 3 no está instalado"
    echo "   Instala Python desde: https://www.python.org/downloads/"
    exit 1
fi

python_version=$(python3 --version)
echo " $python_version encontrado"
echo ""

# Crear entorno virtual
echo " Creando entorno virtual..."
if [ -d "venv" ]; then
    echo "  El entorno virtual ya existe"
    read -p "   ¿Deseas recrearlo? (y/n): " recreate
    if [ "$recreate" = "y" ]; then
        rm -rf venv
        python3 -m venv venv
        echo " Entorno virtual recreado"
    fi
else
    python3 -m venv venv
    echo " Entorno virtual creado"
fi
echo ""

# Activar entorno virtual
echo " Activando entorno virtual..."
source venv/bin/activate
echo " Entorno virtual activado"
echo ""

# Preguntar tipo de instalación
echo " Tipo de instalación:"
echo "   1) Básica (rápida, sin Prophet)"
echo "   2) Completa (con Prophet - mejor predicción pero más lenta)"
read -p "   Selecciona (1/2): " install_type
echo ""

if [ "$install_type" = "2" ]; then
    echo " Instalando dependencias completas..."
    pip install --upgrade pip
    pip install -r requirements.txt
    echo " Dependencias completas instaladas"
else
    echo " Instalando dependencias básicas..."
    pip install --upgrade pip
    pip install fastapi uvicorn pandas numpy scikit-learn aiofiles python-dotenv pydantic sqlalchemy
    echo " Dependencias básicas instaladas"
fi
echo ""

# Descargar modelo de español
if [ "$install_type" = "2" ]; then
    read -p " ¿Descargar modelo de español para spaCy? (y/n): " download_model
    if [ "$download_model" = "y" ]; then
        python -m spacy download es_core_news_sm
        echo " Modelo de español descargado"
    fi
    echo ""
fi

# Verificar estructura
echo " Verificando estructura de archivos..."
if [ ! -f "app.py" ]; then
    echo " Archivo app.py no encontrado"
    exit 1
fi
if [ ! -d "models" ]; then
    echo " Directorio models/ no encontrado"
    exit 1
fi
if [ ! -d "utils" ]; then
    echo " Directorio utils/ no encontrado"
    exit 1
fi
echo " Estructura verificada"
echo ""

# Configuración
echo " Configuración:"
echo ""
echo "    Base de datos esperada en: ../database/opinaplus.db"
echo "    Servidor se ejecutará en: http://localhost:8000"
echo ""

# Crear .env si no existe
if [ ! -f ".env" ]; then
    cp .env.example .env 2>/dev/null || echo "DATABASE_PATH=../database/opinaplus.db" > .env
    echo " Archivo .env creado"
    echo ""
fi

# Mensaje final
echo "¡Instalación completada!"
echo ""
echo " Próximos pasos:"
echo "   1. Activar entorno virtual: source venv/bin/activate"
echo "   2. Iniciar servidor: python app.py"
echo "   3. Abrir documentación: http://localhost:8000/docs"
echo ""
echo " Tip: Para dispositivos físicos, configura la IP en controllers/MLController.js"
echo ""
