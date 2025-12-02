"""
Modelo de Análisis de Sentimiento para Peticiones UPQ
Versión ligera usando Scikit-learn
"""
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import pickle
import os
from pathlib import Path
import sys

# Agregar utils al path
sys.path.append(str(Path(__file__).parent.parent))
from utils.preprocessing import TextPreprocessor

class SentimentAnalyzer:
    """Analizador de sentimiento para textos en español"""
    
    def __init__(self, model_path='sentiment_model.pkl'):
        self.preprocessor = TextPreprocessor()
        self.vectorizer = TfidfVectorizer(max_features=3000, ngram_range=(1, 2))
        self.model = MultinomialNB()
        self.model_path = Path(__file__).parent / model_path
        self.is_trained = False
        
        # Intentar cargar modelo si existe
        if self.model_path.exists():
            self.load_model()
    
    def preprocess(self, texto):
        """Preprocesa el texto"""
        return self.preprocessor.preprocess(
            texto, 
            remove_accents=False, 
            remove_stopwords=True
        )
    
    def train(self, textos, etiquetas):
        """
        Entrena el modelo con datos etiquetados
        
        Args:
            textos: Lista de textos (descripción de peticiones)
            etiquetas: Lista de etiquetas ('positivo', 'neutral', 'negativo')
        """
        # Preprocesar textos
        textos_procesados = [self.preprocess(t) for t in textos]
        
        # Dividir en train/test
        X_train, X_test, y_train, y_test = train_test_split(
            textos_procesados, etiquetas, test_size=0.2, random_state=42
        )
        
        # Entrenar vectorizador y modelo
        X_train_tfidf = self.vectorizer.fit_transform(X_train)
        self.model.fit(X_train_tfidf, y_train)
        
        # Evaluar
        X_test_tfidf = self.vectorizer.transform(X_test)
        y_pred = self.model.predict(X_test_tfidf)
        
        print("\\nReporte de Clasificación")
        print(classification_report(y_test, y_pred))
        
        self.is_trained = True
        self.save_model()
    
    def analyze(self, texto):
        """
        Analiza el sentimiento de un texto
        
        Args:
            texto: Texto a analizar
            
        Returns:
            Dict con sentimiento, confianza y scores
        """
        if not self.is_trained:
            # Retornar análisis por palabras clave si no está entrenado
            return self._analyze_keywords(texto)
        
        # Preprocesar
        texto_procesado = self.preprocess(texto)
        
        # Vectorizar
        X = self.vectorizer.transform([texto_procesado])
        
        # Predecir
        prediccion = self.model.predict(X)[0]
        probabilidades = self.model.predict_proba(X)[0]
        
        # Obtener scores por clase
        clases = self.model.classes_
        scores = {clase: float(prob) for clase, prob in zip(clases, probabilidades)}
        
        return {
            'sentimiento': prediccion,
            'confianza': float(max(probabilidades)),
            'scores': scores
        }
    
    def _analyze_keywords(self, texto):
        """
        Análisis basado en palabras clave cuando no hay modelo entrenado
        Útil para bootstrapping inicial
        """
        texto_lower = texto.lower()
        
        # Palabras clave negativas
        negativas = [
            'malo', 'problema', 'falla', 'roto', 'no funciona', 'descompuesto',
            'sucio', 'molesto', 'insuficiente', 'pésimo', 'terrible', 'horrible',
            'deficiente', 'inadecuado', 'inaceptable', 'urgente', 'crítico'
        ]
        
        # Palabras clave positivas
        positivas = [
            'bueno', 'excelente', 'funciona', 'bien', 'gracias', 'perfecto',
            'limpio', 'agradable', 'suficiente', 'adecuado', 'satisfecho'
        ]
        
        # Contar coincidencias
        score_negativo = sum(1 for palabra in negativas if palabra in texto_lower)
        score_positivo = sum(1 for palabra in positivas if palabra in texto_lower)
        
        # Determinar sentimiento
        if score_negativo > score_positivo:
            sentimiento = 'negativo'
            confianza = min(0.6 + (score_negativo * 0.1), 0.9)
        elif score_positivo > score_negativo:
            sentimiento = 'positivo'
            confianza = min(0.6 + (score_positivo * 0.1), 0.9)
        else:
            sentimiento = 'neutral'
            confianza = 0.5
        
        return {
            'sentimiento': sentimiento,
            'confianza': confianza,
            'scores': {
                'negativo': score_negativo / max(score_negativo + score_positivo, 1),
                'neutral': 0.33,
                'positivo': score_positivo / max(score_negativo + score_positivo, 1)
            },
            'metodo': 'keywords'
        }
    
    def save_model(self):
        """Guarda el modelo entrenado"""
        with open(self.model_path, 'wb') as f:
            pickle.dump({
                'vectorizer': self.vectorizer,
                'model': self.model,
                'is_trained': self.is_trained
            }, f)
        print(f" Modelo guardado en {self.model_path}")
    
    def load_model(self):
        """Carga un modelo previamente entrenado"""
        try:
            with open(self.model_path, 'rb') as f:
                data = pickle.load(f)
                self.vectorizer = data['vectorizer']
                self.model = data['model']
                self.is_trained = data['is_trained']
            print(f"✓ Modelo cargado desde {self.model_path}")
        except Exception as e:
            print(f"⚠ No se pudo cargar el modelo: {e}")
            self.is_trained = False
