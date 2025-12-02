import PeticionModel from '../models/PeticionModel';

/**
 * Controlador para manejar la lógica de negocio de las peticiones
 */
class PeticionController {
  /**
   * Crea una nueva petición
   */
  static async crearPeticion(datos) {
    try {
      // Validaciones
      if (!datos.titulo || !datos.titulo.trim()) {
        throw new Error('El título es obligatorio');
      }
      if (!datos.descripcion || !datos.descripcion.trim()) {
        throw new Error('La descripción es obligatoria');
      }
      if (!datos.categoria || !datos.categoria.trim()) {
        throw new Error('La categoría es obligatoria');
      }

      // Crear petición
      const peticion = await PeticionModel.create({
        titulo: datos.titulo.trim(),
        descripcion: datos.descripcion.trim(),
        categoria: datos.categoria.trim(),
        adjunto: datos.adjunto ? datos.adjunto.trim() : null
      });

      return {
        success: true,
        data: peticion,
        message: 'Petición creada exitosamente'
      };
    } catch (error) {
      console.error('Error en crearPeticion:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtiene todas las peticiones
   */
  static async obtenerPeticiones() {
    try {
      const peticiones = await PeticionModel.getAll();
      return {
        success: true,
        data: peticiones
      };
    } catch (error) {
      console.error('Error en obtenerPeticiones:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtiene todas las peticiones (alias para admin)
   */
  static async obtenerTodasPeticiones() {
    try {
      const peticiones = await PeticionModel.getAll();
      return {
        exito: true,
        data: peticiones,
        mensaje: 'Peticiones obtenidas exitosamente'
      };
    } catch (error) {
      console.error('Error en obtenerTodasPeticiones:', error);
      return {
        exito: false,
        mensaje: error.message
      };
    }
  }

  /**
   * Actualiza solo el estado de una petición
   */
  static async actualizarEstado(id, nuevoEstado) {
    try {
      const peticionActual = await PeticionModel.getById(id);
      if (!peticionActual) {
        throw new Error('Petición no encontrada');
      }

      const peticion = await PeticionModel.update(id, {
        ...peticionActual,
        estado: nuevoEstado
      });

      return {
        exito: true,
        data: peticion,
        mensaje: `Estado actualizado a ${nuevoEstado}`
      };
    } catch (error) {
      console.error('Error en actualizarEstado:', error);
      return {
        exito: false,
        mensaje: error.message
      };
    }
  }

  /**
   * Obtiene una petición por ID
   */
  static async obtenerPeticionPorId(id) {
    try {
      const peticion = await PeticionModel.getById(id);
      if (!peticion) {
        throw new Error('Petición no encontrada');
      }
      return {
        success: true,
        data: peticion
      };
    } catch (error) {
      console.error('Error en obtenerPeticionPorId:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtiene peticiones por estado (abiertas o resueltas)
   */
  static async obtenerPeticionesPorEstado(estado) {
    try {
      const peticiones = await PeticionModel.getByEstado(estado);
      return {
        success: true,
        data: peticiones
      };
    } catch (error) {
      console.error('Error en obtenerPeticionesPorEstado:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Actualiza una petición
   */
  static async actualizarPeticion(id, datos) {
    try {
      // Validaciones
      if (!datos.titulo || !datos.titulo.trim()) {
        throw new Error('El título es obligatorio');
      }
      if (!datos.descripcion || !datos.descripcion.trim()) {
        throw new Error('La descripción es obligatoria');
      }
      if (!datos.categoria || !datos.categoria.trim()) {
        throw new Error('La categoría es obligatoria');
      }

      const peticion = await PeticionModel.update(id, {
        titulo: datos.titulo.trim(),
        descripcion: datos.descripcion.trim(),
        categoria: datos.categoria.trim(),
        adjunto: datos.adjunto ? datos.adjunto.trim() : null,
        estado: datos.estado || 'abierta'
      });

      return {
        success: true,
        data: peticion,
        message: 'Petición actualizada exitosamente'
      };
    } catch (error) {
      console.error('Error en actualizarPeticion:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Cambia el estado de una petición
   */
  static async cambiarEstadoPeticion(id, nuevoEstado) {
    try {
      const peticionActual = await PeticionModel.getById(id);
      if (!peticionActual) {
        throw new Error('Petición no encontrada');
      }

      const peticion = await PeticionModel.update(id, {
        ...peticionActual,
        estado: nuevoEstado
      });

      return {
        success: true,
        data: peticion,
        message: `Petición marcada como ${nuevoEstado}`
      };
    } catch (error) {
      console.error('Error en cambiarEstadoPeticion:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Elimina una petición
   */
  static async eliminarPeticion(id) {
    try {
      const result = await PeticionModel.delete(id);
      return {
        success: true,
        message: 'Petición eliminada exitosamente'
      };
    } catch (error) {
      console.error('Error en eliminarPeticion:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtiene estadísticas de peticiones
   */
  static async obtenerEstadisticas() {
    try {
      const abiertas = await PeticionModel.countByEstado('abierta');
      const resueltas = await PeticionModel.countByEstado('resuelta');
      
      return {
        success: true,
        data: {
          abiertas,
          resueltas,
          total: abiertas + resueltas
        }
      };
    } catch (error) {
      console.error('Error en obtenerEstadisticas:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default PeticionController;
