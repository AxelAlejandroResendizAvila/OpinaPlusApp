"""
API Backend Simple para Machine Learning - OpinaPlusApp
Versión ligera sin dependencias pesadas
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import sqlite3
import re
from pathlib import Path

# Inicializar FastAPI
app = FastAPI(
    title="OpinaPlusML API",
    description="API de Machine Learning para análisis de peticiones UPQ",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruta a la base de datos
DB_PATH = Path(__file__).parent.parent / 'database' / 'opinaplus.db'

# Modelos Pydantic
class TextoAnalisis(BaseModel):
    texto: str

class PeticionCompleta(BaseModel):
    titulo: str
    descripcion: str

class PeticionData(BaseModel):
    id: Optional[int] = None
    titulo: str
    descripcion: str
    categoria: Optional[str] = None
    estado: Optional[str] = None
    fecha_creacion: Optional[str] = None
    usuario_id: Optional[int] = None

class InsightsRequest(BaseModel):
    peticiones: list[PeticionData]

#FUNCIONES DE ANÁLISIS 

def analizar_sentimiento_simple(texto):
    """Análisis de sentimiento basado en palabras clave"""
    texto_lower = texto.lower()
    
    # Palabras negativas
    negativas = [
        'malo', 'problema', 'falla', 'roto', 'no funciona', 'descompuesto',
        'sucio', 'molesto', 'insuficiente', 'pésimo', 'terrible', 'horrible',
        'deficiente', 'inadecuado', 'inaceptable', 'urgente', 'crítico',
        'rompió', 'dañado', 'sucio', 'peligroso', 'molestia', 'inútil'
    ]
    
    # Palabras positivas
    positivas = [
        'bueno', 'excelente', 'funciona', 'bien', 'gracias', 'perfecto',
        'limpio', 'agradable', 'suficiente', 'adecuado', 'satisfecho',
        'genial', 'fantástico', 'óptimo', 'mejor'
    ]
    
    score_negativo = sum(1 for palabra in negativas if palabra in texto_lower)
    score_positivo = sum(1 for palabra in positivas if palabra in texto_lower)
    
    total = score_negativo + score_positivo
    
    if score_negativo > score_positivo:
        sentimiento = 'negativo'
        confianza = min(0.6 + (score_negativo * 0.1), 0.9)
        scores = {
            'negativo': score_negativo / max(total, 1),
            'neutral': 0.2,
            'positivo': score_positivo / max(total, 1)
        }
    elif score_positivo > score_negativo:
        sentimiento = 'positivo'
        confianza = min(0.6 + (score_positivo * 0.1), 0.9)
        scores = {
            'negativo': score_negativo / max(total, 1),
            'neutral': 0.2,
            'positivo': score_positivo / max(total, 1)
        }
    else:
        sentimiento = 'neutral'
        confianza = 0.5
        scores = {
            'negativo': 0.33,
            'neutral': 0.34,
            'positivo': 0.33
        }
    
    return {
        'sentimiento': sentimiento,
        'confianza': confianza,
        'scores': scores,
        'metodo': 'keywords'
    }

def obtener_peticiones():
    """Obtiene todas las peticiones de la base de datos"""
    try:
        conn = sqlite3.connect(str(DB_PATH))
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, titulo, descripcion, categoria, estado, fecha_creacion, usuario_id
            FROM peticiones
            ORDER BY fecha_creacion DESC
        """)
        
        peticiones = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return peticiones
    except Exception as e:
        print(f"Error obteniendo peticiones: {e}")
        return []

def predecir_volumen_simple(peticiones, dias=7):
    """Predicción simple basada en promedio"""
    if not peticiones:
        return {
            'predicciones': [],
            'resumen': {
                'promedio_predicho': 0,
                'minimo': 0,
                'maximo': 0,
                'total_predicho': 0,
                'metodo': 'sin_datos'
            }
        }
    
    # Calcular promedio de peticiones por día (últimos 30 días)
    from collections import defaultdict
    conteo_por_dia = defaultdict(int)
    
    for p in peticiones:
        try:
            fecha = datetime.fromisoformat(p['fecha_creacion'].replace('Z', '+00:00'))
            fecha_str = fecha.date().isoformat()
            conteo_por_dia[fecha_str] += 1
        except:
            continue
    
    if conteo_por_dia:
        promedio = sum(conteo_por_dia.values()) / len(conteo_por_dia)
        desviacion = promedio * 0.3
    else:
        promedio = 5
        desviacion = 2
    
    # Generar predicciones
    predicciones = []
    for i in range(dias):
        fecha_pred = datetime.now().date() + timedelta(days=i+1)
        predicciones.append({
            'ds': fecha_pred.isoformat(),
            'yhat': int(round(promedio)),
            'yhat_lower': int(round(max(0, promedio - desviacion))),
            'yhat_upper': int(round(promedio + desviacion))
        })
    
    return {
        'predicciones': predicciones,
        'resumen': {
            'promedio_predicho': int(round(promedio)),
            'minimo': int(round(max(0, promedio - desviacion))),
            'maximo': int(round(promedio + desviacion)),
            'total_predicho': int(round(promedio * dias)),
            'metodo': 'promedio_simple'
        }
    }

# ==================== ENDPOINTS ====================

@app.get("/")
async def root():
    return {
        "nombre": "OpinaPlusML API",
        "version": "1.0.0",
        "estado": "activo"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "database": "connected" if DB_PATH.exists() else "not_found"
    }

@app.post("/api/sentiment")
async def analizar_sentimiento(peticion: TextoAnalisis):
    try:
        resultado = analizar_sentimiento_simple(peticion.texto)
        return {"exito": True, "data": resultado}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/sentiment/peticion")
async def analizar_peticion_completa(peticion: PeticionCompleta):
    try:
        texto = f"{peticion.titulo}. {peticion.descripcion}"
        resultado = analizar_sentimiento_simple(texto)
        return {"exito": True, "data": resultado}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sentiment/batch")
async def analizar_todas_peticiones():
    try:
        peticiones = obtener_peticiones()
        
        if not peticiones:
            return {
                "exito": True,
                "mensaje": "No hay peticiones",
                "estadisticas": {
                    "total": 0,
                    "positivos": 0,
                    "neutrales": 0,
                    "negativos": 0
                },
                "peticiones": []
            }
        
        resultados = []
        for p in peticiones:
            texto = f"{p['titulo']}. {p['descripcion']}"
            analisis = analizar_sentimiento_simple(texto)
            
            resultados.append({
                "id": p['id'],
                "titulo": p['titulo'],
                "categoria": p['categoria'],
                "estado": p['estado'],
                "sentimiento": analisis['sentimiento'],
                "confianza": round(analisis['confianza'], 3)
            })
        
        # Estadísticas
        total = len(resultados)
        positivos = sum(1 for r in resultados if r['sentimiento'] == 'positivo')
        neutrales = sum(1 for r in resultados if r['sentimiento'] == 'neutral')
        negativos = sum(1 for r in resultados if r['sentimiento'] == 'negativo')
        
        return {
            "exito": True,
            "estadisticas": {
                "total": total,
                "positivos": positivos,
                "neutrales": neutrales,
                "negativos": negativos,
                "porcentaje_positivos": round((positivos / total) * 100, 1) if total > 0 else 0,
                "porcentaje_neutrales": round((neutrales / total) * 100, 1) if total > 0 else 0,
                "porcentaje_negativos": round((negativos / total) * 100, 1) if total > 0 else 0,
                "confianza_promedio": 0.7
            },
            "peticiones": resultados
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/volume/predict")
async def predecir_volumen(days: int = 7):
    try:
        if days < 1 or days > 90:
            raise HTTPException(status_code=400, detail="Días debe estar entre 1 y 90")
        
        peticiones = obtener_peticiones()
        resultado = predecir_volumen_simple(peticiones, days)
        
        return {
            "exito": True,
            "dias_predichos": days,
            "predicciones": resultado['predicciones'],
            "resumen": resultado['resumen'],
            "datos_historicos": len(peticiones)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/insights")
async def obtener_insights_post(request: InsightsRequest):
    """Endpoint POST que recibe las peticiones desde la app"""
    try:
        peticiones = [dict(p) for p in request.peticiones]
        
        # Análisis de sentimiento
        positivos = 0
        negativos = 0
        neutrales = 0
        confianza_total = 0
        
        for pet in peticiones:
            texto = f"{pet['titulo']} {pet['descripcion']}"
            resultado = analizar_sentimiento_simple(texto)
            
            if resultado['sentimiento'] == 'positivo':
                positivos += 1
            elif resultado['sentimiento'] == 'negativo':
                negativos += 1
            else:
                neutrales += 1
            
            confianza_total += resultado['confianza']
        
        total = len(peticiones)
        stats = {
            'total': total,
            'positivos': positivos,
            'negativos': negativos,
            'neutrales': neutrales,
            'porcentaje_positivos': round((positivos / total * 100) if total > 0 else 0, 1),
            'porcentaje_negativos': round((negativos / total * 100) if total > 0 else 0, 1),
            'porcentaje_neutrales': round((neutrales / total * 100) if total > 0 else 0, 1),
            'confianza_promedio': round((confianza_total / total) if total > 0 else 0, 1)
        }
        
        # Predicción de volumen
        vol_result = predecir_volumen_simple(peticiones, dias=7)
        
        # Generar recomendaciones
        recomendaciones = []
        
        if total > 0:
            if negativos > total * 0.5:
                recomendaciones.append({
                    "tipo": "alerta",
                    "mensaje": f"Alto porcentaje de peticiones negativas ({stats['porcentaje_negativos']}%). Revisar urgente."
                })
            
            if vol_result['resumen']['promedio_predicho'] > 10:
                recomendaciones.append({
                    "tipo": "info",
                    "mensaje": f"Se espera alto volumen próximamente (~{vol_result['resumen']['promedio_predicho']} peticiones/día)"
                })
            
            if positivos > total * 0.6:
                recomendaciones.append({
                    "tipo": "exito",
                    "mensaje": f"Buen clima general con {stats['porcentaje_positivos']}% de sentimiento positivo"
                })
        
        return {
            "exito": True,
            "timestamp": datetime.now().isoformat(),
            "sentimiento": stats,
            "volumen_predicho": vol_result['resumen'],
            "predicciones_detalle": vol_result['predicciones'][:7],
            "recomendaciones": recomendaciones
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/insights")
async def obtener_insights():
    """Endpoint GET para compatibilidad (usa base de datos local)"""
    try:
        # Análisis de sentimiento
        sent_result = await analizar_todas_peticiones()
        
        # Predicción de volumen
        vol_result = await predecir_volumen(days=7)
        
        # Generar recomendaciones
        stats = sent_result['estadisticas']
        recomendaciones = []
        
        if stats['total'] > 0:
            if stats['negativos'] > stats['total'] * 0.5:
                recomendaciones.append({
                    "tipo": "alerta",
                    "mensaje": f"Alto porcentaje de peticiones negativas ({stats['porcentaje_negativos']}%). Revisar urgente."
                })
            
            if vol_result['resumen']['promedio_predicho'] > 10:
                recomendaciones.append({
                    "tipo": "info",
                    "mensaje": f"Se espera alto volumen próximamente (~{vol_result['resumen']['promedio_predicho']} peticiones/día)"
                })
            
            if stats['positivos'] > stats['total'] * 0.6:
                recomendaciones.append({
                    "tipo": "exito",
                    "mensaje": f"Buen clima general con {stats['porcentaje_positivos']}% de sentimiento positivo"
                })
        
        return {
            "exito": True,
            "timestamp": datetime.now().isoformat(),
            "sentimiento": stats,
            "volumen_predicho": vol_result['resumen'],
            "predicciones_detalle": vol_result['predicciones'][:7],
            "recomendaciones": recomendaciones
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats")
async def obtener_estadisticas():
    try:
        peticiones = obtener_peticiones()
        
        if not peticiones:
            return {"exito": True, "total_peticiones": 0}
        
        from collections import Counter
        por_estado = Counter(p['estado'] for p in peticiones)
        por_categoria = Counter(p['categoria'] for p in peticiones)
        
        return {
            "exito": True,
            "total_peticiones": len(peticiones),
            "por_estado": dict(por_estado),
            "por_categoria": dict(por_categoria)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("\n Iniciando OpinaPlusML API...")
    print(" Dashboard: http://localhost:8000/docs")
    print(" Health check: http://localhost:8000/api/health\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)
