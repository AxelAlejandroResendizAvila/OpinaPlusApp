"""
Utilidad para conectar con la base de datos SQLite de OpinaPlusApp
"""
import sqlite3
import pandas as pd
from pathlib import Path

class Database:
    def __init__(self, db_path='../database/opinaplus.db'):
        """
        Inicializa la conexión a la base de datos
        
        Args:
            db_path: Ruta relativa o absoluta a la base de datos SQLite
        """
        self.db_path = Path(__file__).parent.parent / db_path
        
    def get_connection(self):
        """Retorna una conexión a la base de datos"""
        return sqlite3.connect(str(self.db_path))
    
    def get_all_peticiones(self):
        """
        Obtiene todas las peticiones de la base de datos
        
        Returns:
            DataFrame con todas las peticiones
        """
        conn = self.get_connection()
        query = """
            SELECT 
                id,
                titulo,
                descripcion,
                categoria,
                estado,
                fecha_creacion,
                usuario_id,
                adjunto
            FROM peticiones
            ORDER BY fecha_creacion DESC
        """
        df = pd.read_sql_query(query, conn, parse_dates=['fecha_creacion'])
        conn.close()
        return df
    
    def get_peticiones_by_estado(self, estado):
        """
        Obtiene peticiones filtradas por estado
        
        Args:
            estado: abierta, en_proceso, resuelta, cerrada
            
        Returns:
            DataFrame con peticiones del estado especificado
        """
        conn = self.get_connection()
        query = """
            SELECT *
            FROM peticiones
            WHERE estado = ?
            ORDER BY fecha_creacion DESC
        """
        df = pd.read_sql_query(query, conn, params=(estado,), parse_dates=['fecha_creacion'])
        conn.close()
        return df
    
    def get_peticiones_historico(self):
        """
        Obtiene el histórico de peticiones agrupado por día
        para análisis de series temporales
        
        Returns:
            DataFrame con fecha y conteo de peticiones por día
        """
        conn = self.get_connection()
        query = """
            SELECT 
                DATE(fecha_creacion) as fecha,
                COUNT(*) as cantidad
            FROM peticiones
            GROUP BY DATE(fecha_creacion)
            ORDER BY fecha
        """
        df = pd.read_sql_query(query, conn, parse_dates=['fecha'])
        conn.close()
        return df
    
    def update_peticion_sentimiento(self, peticion_id, sentimiento, confianza):
        """
        Actualiza el análisis de sentimiento de una petición
        Nota: Necesitarás agregar columnas 'sentimiento' y 'sentimiento_confianza' 
        a la tabla peticiones si quieres persistir esta info
        
        Args:
            peticion_id: ID de la petición
            sentimiento: positivo, neutral, negativo
            confianza: float entre 0 y 1
        """
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Verifica si las columnas existen, si no, créalas
        try:
            cursor.execute("""
                ALTER TABLE peticiones 
                ADD COLUMN sentimiento TEXT
            """)
            cursor.execute("""
                ALTER TABLE peticiones 
                ADD COLUMN sentimiento_confianza REAL
            """)
            conn.commit()
        except sqlite3.OperationalError:
            # Las columnas ya existen
            pass
        
        # Actualiza el sentimiento
        cursor.execute("""
            UPDATE peticiones 
            SET sentimiento = ?, sentimiento_confianza = ?
            WHERE id = ?
        """, (sentimiento, confianza, peticion_id))
        
        conn.commit()
        conn.close()
