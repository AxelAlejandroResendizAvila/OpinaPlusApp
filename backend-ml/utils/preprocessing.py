"""
Utilidades para preprocesamiento de texto en español
"""
import re
import unicodedata

class TextPreprocessor:
    """Limpia y normaliza texto en español"""
    
    def __init__(self):
        self.stopwords_es = {
            'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'ser', 'se', 
            'no', 'haber', 'por', 'con', 'su', 'para', 'como', 'estar', 
            'tener', 'le', 'lo', 'todo', 'pero', 'más', 'hacer', 'o', 
            'poder', 'decir', 'este', 'ir', 'otro', 'ese', 'la', 'si', 
            'me', 'ya', 'ver', 'porque', 'dar', 'cuando', 'él', 'muy', 
            'sin', 'vez', 'mucho', 'saber', 'qué', 'sobre', 'mi', 'alguno',
            'mismo', 'yo', 'también', 'hasta', 'año', 'dos', 'querer', 
            'entre', 'así', 'primero', 'desde', 'grande', 'eso', 'ni', 
            'nos', 'llegar', 'pasar', 'tiempo', 'ella', 'sí', 'día', 
            'uno', 'bien', 'poco', 'deber', 'entonces', 'poner', 'cosa', 
            'tanto', 'hombre', 'parecer', 'nuestro', 'tan', 'donde', 
            'ahora', 'parte', 'después', 'vida', 'quedar', 'siempre', 
            'creer', 'hablar', 'llevar', 'dejar', 'nada', 'cada', 'seguir',
            'menos', 'nuevo', 'encontrar', 'algo', 'solo', 'decir', 'salir'
        }
    
    def remove_accents(self, text):
        """Elimina acentos del texto"""
        return ''.join(
            c for c in unicodedata.normalize('NFD', text)
            if unicodedata.category(c) != 'Mn'
        )
    
    def clean_text(self, text):
        """Limpia el texto de caracteres especiales y normaliza"""
        # Convertir a minúsculas
        text = text.lower()
        
        # Eliminar URLs
        text = re.sub(r'http\S+|www.\S+', '', text)
        
        # Eliminar menciones y hashtags
        text = re.sub(r'@\w+|#\w+', '', text)
        
        # Eliminar números
        text = re.sub(r'\d+', '', text)
        
        # Eliminar puntuación (mantener espacios)
        text = re.sub(r'[^\w\s]', ' ', text)
        
        # Eliminar espacios múltiples
        text = re.sub(r'\s+', ' ', text)
        
        return text.strip()
    
    def remove_stopwords(self, text):
        """Elimina palabras vacías"""
        words = text.split()
        filtered_words = [word for word in words if word not in self.stopwords_es]
        return ' '.join(filtered_words)
    
    def preprocess(self, text, remove_accents=False, remove_stopwords=False):
        """
        Pipeline completo de preprocesamiento
        
        Args:
            text: Texto a procesar
            remove_accents: Si True, elimina acentos
            remove_stopwords: Si True, elimina stopwords
            
        Returns:
            Texto procesado
        """
        # Limpieza básica
        text = self.clean_text(text)
        
        # Remover acentos si se solicita
        if remove_accents:
            text = self.remove_accents(text)
        
        # Remover stopwords si se solicita
        if remove_stopwords:
            text = self.remove_stopwords(text)
        
        return text
