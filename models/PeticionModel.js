import { getDatabase } from '../database/database';

/**
 * Modelo para manejar las operaciones de base de datos de Peticiones
 */
class PeticionModel {
  /**
   * Crea una nueva petición en la base de datos
   */
  static async create(peticion) {
    try {
      const db = getDatabase();
      const { titulo, descripcion, categoria, adjunto } = peticion;
      
      const result = await db.runAsync(
        `INSERT INTO peticiones (titulo, descripcion, categoria, adjunto) VALUES (?, ?, ?, ?)`,
        [titulo, descripcion, categoria, adjunto || null]
      );
      
      return {
        id: result.lastInsertRowId,
        titulo,
        descripcion,
        categoria,
        adjunto,
        estado: 'abierta',
        fecha_creacion: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error al crear petición:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las peticiones
   */
  static async getAll() {
    try {
      const db = getDatabase();
      const peticiones = await db.getAllAsync('SELECT * FROM peticiones ORDER BY fecha_creacion DESC');
      console.log('🗄️ DB DEBUG - Total peticiones en base de datos:', peticiones.length);
      console.log('🗄️ DB DEBUG - Primera petición:', peticiones[0]);
      return peticiones;
    } catch (error) {
      console.error('Error al obtener peticiones:', error);
      throw error;
    }
  }

  /**
   * Obtiene una petición por ID
   */
  static async getById(id) {
    try {
      const db = getDatabase();
      const peticion = await db.getFirstAsync('SELECT * FROM peticiones WHERE id = ?', [id]);
      return peticion;
    } catch (error) {
      console.error('Error al obtener petición por ID:', error);
      throw error;
    }
  }

  /**
   * Obtiene peticiones por estado
   */
  static async getByEstado(estado) {
    try {
      const db = getDatabase();
      const peticiones = await db.getAllAsync(
        'SELECT * FROM peticiones WHERE estado = ? ORDER BY fecha_creacion DESC',
        [estado]
      );
      return peticiones;
    } catch (error) {
      console.error('Error al obtener peticiones por estado:', error);
      throw error;
    }
  }

  /**
   * Actualiza una petición
   */
  static async update(id, peticion) {
    try {
      const db = getDatabase();
      const { titulo, descripcion, categoria, adjunto, estado } = peticion;
      
      await db.runAsync(
        `UPDATE peticiones 
         SET titulo = ?, descripcion = ?, categoria = ?, adjunto = ?, estado = ?, fecha_actualizacion = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [titulo, descripcion, categoria, adjunto || null, estado || 'abierta', id]
      );
      
      return await this.getById(id);
    } catch (error) {
      console.error('Error al actualizar petición:', error);
      throw error;
    }
  }

  /**
   * Elimina una petición
   */
  static async delete(id) {
    try {
      const db = getDatabase();
      await db.runAsync('DELETE FROM peticiones WHERE id = ?', [id]);
      return { success: true, id };
    } catch (error) {
      console.error('Error al eliminar petición:', error);
      throw error;
    }
  }

  /**
   * Cuenta peticiones por estado
   */
  static async countByEstado(estado) {
    try {
      const db = getDatabase();
      const result = await db.getFirstAsync(
        'SELECT COUNT(*) as count FROM peticiones WHERE estado = ?',
        [estado]
      );
      return result.count;
    } catch (error) {
      console.error('Error al contar peticiones:', error);
      throw error;
    }
  }
}

export default PeticionModel;
