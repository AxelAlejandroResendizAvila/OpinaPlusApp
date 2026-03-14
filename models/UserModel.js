import { getDatabase } from '../database/database';
import * as Crypto from 'expo-crypto';

/**
 * Modelo para manejar las operaciones de base de datos de Usuarios
 */
class UserModel {
  /**
   * Hashea una contraseña usando SHA256
   */
  static async hashPassword(password) {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
  }

  /**
   * Genera un código aleatorio de 6 dígitos
   */
  static generateRecoveryCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Registra un nuevo usuario
   */
  static async create(usuario) {
    try {
      const db = getDatabase();
      const { nombre, email, password, rol = 'usuario' } = usuario;
      
      // Hashear contraseña
      const hashedPassword = await this.hashPassword(password);
      
      const result = await db.runAsync(
        `INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)`,
        [nombre, email, hashedPassword, rol]
      );
      
      return {
        id: result.lastInsertRowId,
        nombre,
        email,
        rol,
        fecha_creacion: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  /**
   * Busca usuario por email
   */
  static async findByEmail(email) {
    try {
      const db = getDatabase();
      // Buscar case-insensitive usando LOWER()
      const usuario = await db.getFirstAsync(
        'SELECT * FROM usuarios WHERE LOWER(email) = LOWER(?)',
        [email]
      );
      console.log(`[UserModel.findByEmail] Buscando: "${email}" - Resultado:`, usuario ? 'ENCONTRADO' : 'NO ENCONTRADO');
      return usuario;
    } catch (error) {
      console.error('Error al buscar usuario por email:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los usuarios (para debugging)
   */
  static async getAllUsers() {
    try {
      const db = getDatabase();
      const usuarios = await db.getAllAsync('SELECT id, email, nombre, rol FROM usuarios');
      console.log('[UserModel.getAllUsers] Usuarios en BD:', usuarios);
      return usuarios;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return [];
    }
  }

  /**
   * Busca usuario por ID
   */
  static async findById(id) {
    try {
      const db = getDatabase();
      const usuario = await db.getFirstAsync(
        'SELECT id, nombre, email, rol, fecha_creacion, ultimo_acceso FROM usuarios WHERE id = ?',
        [id]
      );
      return usuario;
    } catch (error) {
      console.error('Error al buscar usuario por ID:', error);
      throw error;
    }
  }

  /**
   * Verifica credenciales de login
   */
  static async verifyCredentials(email, password) {
    try {
      const usuario = await this.findByEmail(email);
      if (!usuario) {
        return null;
      }

      const hashedPassword = await this.hashPassword(password);
      if (usuario.password !== hashedPassword) {
        return null;
      }

      // Actualizar último acceso
      await this.updateLastAccess(usuario.id);

      // No retornar el password
      const { password: _, ...usuarioSinPassword } = usuario;
      return usuarioSinPassword;
    } catch (error) {
      console.error('Error al verificar credenciales:', error);
      throw error;
    }
  }

  /**
   * Actualiza último acceso
   */
  static async updateLastAccess(id) {
    try {
      const db = getDatabase();
      await db.runAsync(
        'UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );
    } catch (error) {
      console.error('Error al actualizar último acceso:', error);
      throw error;
    }
  }

  /**
   * Crea token de recuperación
   */
  static async createRecoveryToken(email) {
    try {
      const db = getDatabase();
      const usuario = await this.findByEmail(email);
      
      if (!usuario) {
        return null;
      }

      const codigo = this.generateRecoveryCode();
      const expiracion = new Date();
      expiracion.setMinutes(expiracion.getMinutes() + 15); // 15 minutos

      await db.runAsync(
        `INSERT INTO tokens_recuperacion (usuario_id, codigo, expiracion) VALUES (?, ?, ?)`,
        [usuario.id, codigo, expiracion.toISOString()]
      );

      return {
        codigo,
        email: usuario.email,
        expiracion
      };
    } catch (error) {
      console.error('Error al crear token de recuperación:', error);
      throw error;
    }
  }

  /**
   * Verifica código de recuperación
   */
  static async verifyRecoveryCode(email, codigo) {
    try {
      const db = getDatabase();
      const usuario = await this.findByEmail(email);
      
      if (!usuario) {
        return false;
      }

      const token = await db.getFirstAsync(
        `SELECT * FROM tokens_recuperacion 
         WHERE usuario_id = ? AND codigo = ? AND usado = 0 AND expiracion > datetime('now')
         ORDER BY fecha_creacion DESC LIMIT 1`,
        [usuario.id, codigo]
      );

      return !!token;
    } catch (error) {
      console.error('Error al verificar código:', error);
      throw error;
    }
  }

  /**
   * Cambia contraseña con código de recuperación
   */
  static async resetPassword(email, codigo, nuevaPassword) {
    try {
      const db = getDatabase();
      const usuario = await this.findByEmail(email);
      
      if (!usuario) {
        return false;
      }

      // Verificar código
      const token = await db.getFirstAsync(
        `SELECT * FROM tokens_recuperacion 
         WHERE usuario_id = ? AND codigo = ? AND usado = 0 AND expiracion > datetime('now')
         ORDER BY fecha_creacion DESC LIMIT 1`,
        [usuario.id, codigo]
      );

      if (!token) {
        return false;
      }

      // Hashear nueva contraseña
      const hashedPassword = await this.hashPassword(nuevaPassword);

      // Actualizar contraseña
      await db.runAsync(
        'UPDATE usuarios SET password = ? WHERE id = ?',
        [hashedPassword, usuario.id]
      );

      // Marcar token como usado
      await db.runAsync(
        'UPDATE tokens_recuperacion SET usado = 1 WHERE id = ?',
        [token.id]
      );

      return true;
    } catch (error) {
      console.error('Error al resetear contraseña:', error);
      throw error;
    }
  }

  /**
   * Cambia contraseña (usuario autenticado)
   */
  static async changePassword(id, oldPassword, newPassword) {
    try {
      const db = getDatabase();
      const usuario = await db.getFirstAsync(
        'SELECT * FROM usuarios WHERE id = ?',
        [id]
      );

      if (!usuario) {
        return false;
      }

      // Verificar contraseña actual
      const hashedOldPassword = await this.hashPassword(oldPassword);
      if (usuario.password !== hashedOldPassword) {
        return false;
      }

      // Hashear nueva contraseña
      const hashedNewPassword = await this.hashPassword(newPassword);

      // Actualizar contraseña
      await db.runAsync(
        'UPDATE usuarios SET password = ? WHERE id = ?',
        [hashedNewPassword, id]
      );

      return true;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los usuarios (sin passwords)
   */
  static async getAll() {
    try {
      const db = getDatabase();
      const usuarios = await db.getAllAsync(
        'SELECT id, nombre, email, rol, fecha_creacion, ultimo_acceso FROM usuarios ORDER BY fecha_creacion DESC'
      );
      return usuarios;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  /**
   * Actualiza información del usuario
   */
  static async update(id, datos) {
    try {
      const db = getDatabase();
      const { nombre, email } = datos;
      
      await db.runAsync(
        'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
        [nombre, email, id]
      );
      
      return await this.findById(id);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }

  /**
   * Elimina un usuario
   */
  static async delete(id) {
    try {
      const db = getDatabase();
      await db.runAsync('DELETE FROM usuarios WHERE id = ?', [id]);
      return { success: true, id };
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
}

export default UserModel;
