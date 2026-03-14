/**
 * Script para limpiar la base de datos
 * Ejecutar con: node cleanDatabase.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta donde Expo guarda las BDs (usualmente en node_modules o en documentos del sistema)
const dbPath = path.join(__dirname, 'opinaplus.db');

console.log(`Intentando acceder a BD en: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar a la BD:', err);
    console.log('\nIntentando alternativa: buscar en carpeta de usuario...');
    
    // Alternativa: crear una nueva BD limpia
    exec('rm -f opinaplus.db && echo "BD eliminada"', { cwd: __dirname }, (err) => {
      if (!err) {
        console.log('Base de datos eliminada correctamente');
        process.exit(0);
      } else {
        console.error('Intenta eliminar manualmente el archivo opinaplus.db');
        process.exit(1);
      }
    });
    return;
  }

  // Limpiar tabla de usuarios
  db.run('DELETE FROM usuarios', function(err) {
    if (err) {
      console.error('Error al limpiar usuarios:', err);
      db.close();
      process.exit(1);
    }
    console.log('Tabla de usuarios vaciada');
    
    db.close(() => {
      console.log('Conexión cerrada');
      process.exit(0);
    });
  });
});
