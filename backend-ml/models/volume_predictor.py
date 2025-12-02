"""
Modelo de Predicción de Volumen de Peticiones
Usa Prophet para series temporales
"""
from datetime import datetime, timedelta
import pandas as pd
import sys
from pathlib import Path

# Agregar utils al path
sys.path.append(str(Path(__file__).parent.parent))

try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except ImportError:
    PROPHET_AVAILABLE = False
    print("⚠ Prophet no está instalado. Se usará predicción simple.")

class VolumePredictor:
    """Predictor de volumen de peticiones futuras"""
    
    def __init__(self):
        self.model = None
        self.trained = False
        
        if PROPHET_AVAILABLE:
            self.model = Prophet(
                yearly_seasonality=True,
                weekly_seasonality=True,
                daily_seasonality=False,
                changepoint_prior_scale=0.05,
                seasonality_mode='multiplicative'
            )
    
    def prepare_data(self, peticiones_df):
        """
        Prepara los datos para Prophet
        
        Args:
            peticiones_df: DataFrame con columna fecha_creacion
            
        Returns:
            DataFrame con columnas 'ds' (fecha) y 'y' (cantidad)
        """
        # Agrupar por día y contar
        df = peticiones_df.copy()
        df['fecha'] = pd.to_datetime(df['fecha_creacion']).dt.date
        
        # Contar peticiones por día
        df_grouped = df.groupby('fecha').size().reset_index(name='cantidad')
        
        # Renombrar para Prophet (requiere 'ds' y 'y')
        df_prophet = df_grouped.rename(columns={'fecha': 'ds', 'cantidad': 'y'})
        df_prophet['ds'] = pd.to_datetime(df_prophet['ds'])
        
        # Llenar días faltantes con 0
        date_range = pd.date_range(
            start=df_prophet['ds'].min(),
            end=df_prophet['ds'].max(),
            freq='D'
        )
        df_complete = pd.DataFrame({'ds': date_range})
        df_prophet = df_complete.merge(df_prophet, on='ds', how='left')
        df_prophet['y'] = df_prophet['y'].fillna(0)
        
        return df_prophet
    
    def train(self, peticiones_df):
        """
        Entrena el modelo con datos históricos
        
        Args:
            peticiones_df: DataFrame con peticiones históricas
        """
        if not PROPHET_AVAILABLE:
            print("⚠ Prophet no disponible, usando predicción simple")
            self.trained = False
            return
        
        try:
            data = self.prepare_data(peticiones_df)
            
            if len(data) < 14:  # Mínimo 2 semanas de datos
                print("⚠ Insuficientes datos históricos (mínimo 14 días)")
                self.trained = False
                return
            
            self.model.fit(data)
            self.trained = True
            print(f"✓ Modelo entrenado con {len(data)} días de datos")
        except Exception as e:
            print(f"✗ Error al entrenar: {e}")
            self.trained = False
    
    def predict(self, days_ahead=30, peticiones_df=None):
        """
        Predice el volumen para los próximos días
        
        Args:
            days_ahead: Número de días a predecir
            peticiones_df: DataFrame con datos (si no está entrenado)
            
        Returns:
            Dict con predicciones y resumen
        """
        if PROPHET_AVAILABLE and self.trained:
            return self._predict_with_prophet(days_ahead)
        else:
            # Predicción simple basada en promedio
            return self._predict_simple(days_ahead, peticiones_df)
    
    def _predict_with_prophet(self, days_ahead):
        """Predicción usando Prophet"""
        # Crear dataframe futuro
        future = self.model.make_future_dataframe(periods=days_ahead)
        forecast = self.model.predict(future)
        
        # Extraer solo predicciones futuras
        predicciones = forecast.tail(days_ahead)[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].copy()
        
        # Asegurar valores no negativos
        predicciones['yhat'] = predicciones['yhat'].apply(lambda x: max(0, x))
        predicciones['yhat_lower'] = predicciones['yhat_lower'].apply(lambda x: max(0, x))
        predicciones['yhat_upper'] = predicciones['yhat_upper'].apply(lambda x: max(0, x))
        
        # Convertir a dict
        predicciones_dict = predicciones.to_dict('records')
        for pred in predicciones_dict:
            pred['ds'] = pred['ds'].strftime('%Y-%m-%d')
            pred['yhat'] = int(round(pred['yhat']))
            pred['yhat_lower'] = int(round(pred['yhat_lower']))
            pred['yhat_upper'] = int(round(pred['yhat_upper']))
        
        return {
            'predicciones': predicciones_dict,
            'resumen': {
                'promedio_predicho': int(predicciones['yhat'].mean()),
                'minimo': int(predicciones['yhat_lower'].mean()),
                'maximo': int(predicciones['yhat_upper'].mean()),
                'total_predicho': int(predicciones['yhat'].sum()),
                'metodo': 'prophet'
            }
        }
    
    def _predict_simple(self, days_ahead, peticiones_df):
        """
        Predicción simple basada en promedio de últimos 30 días
        Se usa cuando Prophet no está disponible o hay pocos datos
        """
        if peticiones_df is None or len(peticiones_df) == 0:
            # Sin datos, retornar predicción conservadora
            return {
                'predicciones': [],
                'resumen': {
                    'promedio_predicho': 5,
                    'minimo': 2,
                    'maximo': 10,
                    'total_predicho': 5 * days_ahead,
                    'metodo': 'simple_default'
                }
            }
        
        # Calcular promedio de últimos 30 días
        df = peticiones_df.copy()
        df['fecha'] = pd.to_datetime(df['fecha_creacion']).dt.date
        
        # Últimos 30 días
        fecha_limite = datetime.now().date() - timedelta(days=30)
        df_reciente = df[df['fecha'] >= fecha_limite]
        
        # Contar por día
        conteo_diario = df_reciente.groupby('fecha').size()
        promedio_diario = conteo_diario.mean() if len(conteo_diario) > 0 else 5
        
        # Desviación estándar para rangos
        std_diario = conteo_diario.std() if len(conteo_diario) > 1 else promedio_diario * 0.3
        
        # Generar predicciones
        predicciones = []
        for i in range(days_ahead):
            fecha_pred = datetime.now().date() + timedelta(days=i+1)
            predicciones.append({
                'ds': fecha_pred.strftime('%Y-%m-%d'),
                'yhat': int(round(promedio_diario)),
                'yhat_lower': int(round(max(0, promedio_diario - std_diario))),
                'yhat_upper': int(round(promedio_diario + std_diario))
            })
        
        return {
            'predicciones': predicciones,
            'resumen': {
                'promedio_predicho': int(round(promedio_diario)),
                'minimo': int(round(max(0, promedio_diario - std_diario))),
                'maximo': int(round(promedio_diario + std_diario)),
                'total_predicho': int(round(promedio_diario * days_ahead)),
                'metodo': 'simple_promedio'
            }
        }
