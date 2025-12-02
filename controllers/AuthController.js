import UserModel from '../models/UserModel';

/**
 * Controlador para manejar la lógica de autenticación y usuarios
 */
class AuthController {
  /**
   * Registra un nuevo usuario
   */
  static async registrar(datos) {
    try {
      const { nombre, email, password, confirmPassword } = datos;

      // Validaciones
      if (!nombre || !nombre.trim()) {
        throw new Error('El nombre es obligatorio');
      }
      if (!email || !email.trim()) {
        throw new Error('El email es obligatorio');
      }
      if (!this.validarEmail(email)) {
        throw new Error('El email no es válido');
      }
      if (!password || password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }
      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      // Verificar si el email ya existe
      const usuarioExistente = await UserModel.findByEmail(email.toLowerCase().trim());
      if (usuarioExistente) {
        throw new Error('El email ya está registrado');
      }

      // Determinar rol según dominio del email
      const rol = this.determinarRol(email);

      // Crear usuario
      const usuario = await UserModel.create({
        nombre: nombre.trim(),
        email: email.toLowerCase().trim(),
        password: password,
        rol: rol
      });

      return {
        success: true,
        data: usuario,
        message: 'Usuario registrado exitosamente'
      };
    } catch (error) {
      console.error('Error en registrar:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Inicia sesión
   */
  static async login(email, password) {
    try {
      // Validaciones
      if (!email || !email.trim()) {
        throw new Error('El email es obligatorio');
      }
      if (!password) {
        throw new Error('La contraseña es obligatoria');
      }

      // Verificar credenciales
      const usuario = await UserModel.verifyCredentials(
        email.toLowerCase().trim(),
        password
      );

      if (!usuario) {
        throw new Error('Email o contraseña incorrectos');
      }

      return {
        success: true,
        data: usuario,
        message: 'Inicio de sesión exitoso'
      };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Solicita recuperación de contraseña
   */
  static async solicitarRecuperacion(email) {
    try {
      // Validaciones
      if (!email || !email.trim()) {
        throw new Error('El email es obligatorio');
      }
      if (!this.validarEmail(email)) {
        throw new Error('El email no es válido');
      }

      // Crear token de recuperación
      const token = await UserModel.createRecoveryToken(email.toLowerCase().trim());

      if (!token) {
        // Por seguridad, no revelamos si el email existe o no
        return {
          success: true,
          message: 'Si el email existe, recibirás un código de recuperación'
        };
      }

      return {
        success: true,
        data: { codigo: token.codigo, email: token.email }, // En producción, esto se enviaría por email
        message: 'Código de recuperación generado'
      };
    } catch (error) {
      console.error('Error en solicitar recuperación:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verifica código de recuperación
   */
  static async verificarCodigo(email, codigo) {
    try {
      // Validaciones
      if (!email || !email.trim()) {
        throw new Error('El email es obligatorio');
      }
      if (!codigo || codigo.length !== 6) {
        throw new Error('El código debe tener 6 dígitos');
      }

      const valido = await UserModel.verifyRecoveryCode(
        email.toLowerCase().trim(),
        codigo
      );

      if (!valido) {
        throw new Error('Código inválido o expirado');
      }

      return {
        success: true,
        message: 'Código verificado correctamente'
      };
    } catch (error) {
      console.error('Error en verificar código:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Restablece contraseña con código
   */
  static async restablecerPassword(email, codigo, nuevaPassword, confirmPassword) {
    try {
      // Validaciones
      if (!email || !email.trim()) {
        throw new Error('El email es obligatorio');
      }
      if (!codigo || codigo.length !== 6) {
        throw new Error('El código debe tener 6 dígitos');
      }
      if (!nuevaPassword || nuevaPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }
      if (nuevaPassword !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      const exito = await UserModel.resetPassword(
        email.toLowerCase().trim(),
        codigo,
        nuevaPassword
      );

      if (!exito) {
        throw new Error('Código inválido o expirado');
      }

      return {
        success: true,
        message: 'Contraseña restablecida exitosamente'
      };
    } catch (error) {
      console.error('Error en restablecer password:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Cambia contraseña (usuario autenticado)
   */
  static async cambiarPassword(userId, passwordActual, nuevaPassword, confirmPassword) {
    try {
      // Validaciones
      if (!passwordActual) {
        throw new Error('La contraseña actual es obligatoria');
      }
      if (!nuevaPassword || nuevaPassword.length < 6) {
        throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
      }
      if (nuevaPassword !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }
      if (passwordActual === nuevaPassword) {
        throw new Error('La nueva contraseña debe ser diferente a la actual');
      }

      const exito = await UserModel.changePassword(
        userId,
        passwordActual,
        nuevaPassword
      );

      if (!exito) {
        throw new Error('La contraseña actual es incorrecta');
      }

      return {
        success: true,
        message: 'Contraseña cambiada exitosamente'
      };
    } catch (error) {
      console.error('Error en cambiar password:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtiene información del usuario
   */
  static async obtenerUsuario(userId) {
    try {
      const usuario = await UserModel.findById(userId);
      
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      return {
        success: true,
        data: usuario
      };
    } catch (error) {
      console.error('Error en obtener usuario:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Actualiza información del usuario
   */
  static async actualizarUsuario(userId, datos) {
    try {
      const { nombre, email } = datos;

      // Validaciones
      if (!nombre || !nombre.trim()) {
        throw new Error('El nombre es obligatorio');
      }
      if (!email || !email.trim()) {
        throw new Error('El email es obligatorio');
      }
      if (!this.validarEmail(email)) {
        throw new Error('El email no es válido');
      }

      // Verificar si el nuevo email ya existe (en otro usuario)
      const usuarioConEmail = await UserModel.findByEmail(email.toLowerCase().trim());
      if (usuarioConEmail && usuarioConEmail.id !== userId) {
        throw new Error('El email ya está en uso');
      }

      const usuario = await UserModel.update(userId, {
        nombre: nombre.trim(),
        email: email.toLowerCase().trim()
      });

      return {
        success: true,
        data: usuario,
        message: 'Usuario actualizado exitosamente'
      };
    } catch (error) {
      console.error('Error en actualizar usuario:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Valida formato de email y dominio UPQ
   */
  static validarEmail(email) {
    const regex = /^[^\s@]+@(upq\.edu\.mx|upq\.mx)$/i;
    return regex.test(email);
  }

  /**
   * Determina el rol según el dominio del email
   * @upq.edu.mx -> usuario
   * @upq.mx -> admin
   */
  static determinarRol(email) {
    const emailLower = email.toLowerCase().trim();
    if (emailLower.endsWith('@upq.mx')) {
      return 'admin';
    } else if (emailLower.endsWith('@upq.edu.mx')) {
      return 'usuario';
    }
    return 'usuario'; // por defecto
  }
}

export default AuthController;
