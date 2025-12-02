import * as SQLite from 'expo-sqlite';

let db = null;

/**
 * Inicializa la base de datos y crea las tablas necesarias
 */
export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('opinaplus.db');
    
    // Tabla de peticiones
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS peticiones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        categoria TEXT NOT NULL,
        adjunto TEXT,
        estado TEXT DEFAULT 'abierta',
        usuario_id INTEGER,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      );
    `);

    // Tabla de usuarios
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        rol TEXT DEFAULT 'usuario',
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        ultimo_acceso DATETIME
      );
    `);

    // Tabla de tokens de recuperación
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tokens_recuperacion (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        codigo TEXT NOT NULL,
        expiracion DATETIME NOT NULL,
        usado INTEGER DEFAULT 0,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      );
    `);

    console.log('Base de datos inicializada correctamente');
    return db;
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
};

/**
 * Obtiene la instancia de la base de datos
 */
export const getDatabase = () => {
  if (!db) {
    throw new Error('Base de datos no inicializada. Llama a initDatabase() primero.');
  }
  return db;
};

/**
 * Cierra la conexión a la base de datos
 */
export const closeDatabase = async () => {
  if (db) {
    await db.closeAsync();
    db = null;
  }
};
