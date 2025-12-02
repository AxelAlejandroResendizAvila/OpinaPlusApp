/**
 * Controlador para comunicación con el backend de Machine Learning
 * Maneja análisis de sentimiento y predicción de volumen
 */

class MLController {
  // Configuración de la API
  // IMPORTANTE: Cambia esta URL según tu entorno:
  // - Desarrollo local (iOS Simulator): http://localhost:8000/api
  // - Desarrollo local (Android Emulator): http://10.0.2.2:8000/api
  // - Desarrollo local (dispositivo físico): http://TU_IP_LOCAL:8000/api (ej: http://192.168.1.100:8000/api)
  // - Producción: https://tu-dominio.com/api
  static API_URL = 'http://192.168.0.7:8000/api';

  /**
   * Verifica el estado de la API
   */
  static async verificarEstado() {
    try {
      const response = await fetch(`${this.API_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { exito: true, data };
    } catch (error) {
      console.error('Error verificando estado de ML API:', error);
      return { 
        exito: false, 
        mensaje: 'No se pudo conectar con el servicio de Machine Learning',
        error: error.message 
      };
    }
  }

  /**
   * Analiza el sentimiento de un texto individual
   * @param {string} texto - Texto a analizar
   * @returns {Promise} Resultado del análisis
   */
  static async analizarSentimiento(texto) {
    try {
      const response = await fetch(`${this.API_URL}/sentiment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texto }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en análisis de sentimiento:', error);
      return { 
        exito: false, 
        mensaje: 'Error al analizar sentimiento',
        error: error.message 
      };
    }
  }

  /**
   * Analiza el sentimiento de una petición completa (título + descripción)
   * @param {string} titulo - Título de la petición
   * @param {string} descripcion - Descripción de la petición
   * @returns {Promise} Resultado del análisis
   */
  static async analizarPeticion(titulo, descripcion) {
    try {
      const response = await fetch(`${this.API_URL}/sentiment/peticion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ titulo, descripcion }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en análisis de petición:', error);
      return { 
        exito: false, 
        mensaje: 'Error al analizar petición',
        error: error.message 
      };
    }
  }

  /**
   * Obtiene análisis de sentimiento de todas las peticiones en la BD
   * @returns {Promise} Estadísticas y análisis detallado
   */
  static async obtenerAnalisisBatch() {
    try {
      const response = await fetch(`${this.API_URL}/sentiment/batch`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en análisis batch:', error);
      return { 
        exito: false, 
        mensaje: 'Error al obtener análisis de sentimientos',
        error: error.message 
      };
    }
  }

  /**
   * Predice el volumen de peticiones para los próximos días
   * @param {number} dias - Número de días a predecir (default: 7)
   * @returns {Promise} Predicciones y resumen
   */
  static async predecirVolumen(dias = 7) {
    try {
      const response = await fetch(`${this.API_URL}/volume/predict?days=${dias}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en predicción de volumen:', error);
      return { 
        exito: false, 
        mensaje: 'Error al predecir volumen',
        error: error.message 
      };
    }
  }

  /**
   * Obtiene insights combinados: sentimiento + predicción de volumen
   * Ideal para dashboard de administrador
   * @param {Array} peticiones - Array de peticiones para analizar
   * @returns {Promise} Insights completos con recomendaciones
   */
  static async obtenerInsights(peticiones = null) {
    try {
      // Si se proporcionan peticiones, usar el endpoint POST
      if (peticiones && peticiones.length > 0) {
        const response = await fetch(`${this.API_URL}/insights`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ peticiones }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } else {
        // Si no se proporcionan peticiones, usar el endpoint GET (base de datos local)
        const response = await fetch(`${this.API_URL}/insights`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error obteniendo insights:', error);
      return { 
        exito: false, 
        mensaje: 'Error al obtener insights',
        error: error.message 
      };
    }
  }

  /**
   * Obtiene estadísticas generales de la base de datos
   * @returns {Promise} Estadísticas por estado y categoría
   */
  static async obtenerEstadisticas() {
    try {
      const response = await fetch(`${this.API_URL}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return { 
        exito: false, 
        mensaje: 'Error al obtener estadísticas',
        error: error.message 
      };
    }
  }

  /**
   * Configura la URL de la API
   * Útil para cambiar entre desarrollo y producción
   * @param {string} url - Nueva URL de la API
   */
  static setApiUrl(url) {
    this.API_URL = url;
    console.log(`ML API URL actualizada a: ${url}`);
  }

  /**
   * Obtiene la URL actual de la API
   * @returns {string} URL de la API
   */
  static getApiUrl() {
    return this.API_URL;
  }
}

export default MLController;
