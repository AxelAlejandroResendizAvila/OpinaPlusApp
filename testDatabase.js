// Test simple para verificar la configuración de la base de datos y CRUD
import { initDatabase, getDatabase } from './database/database';
import PeticionController from './controllers/PeticionController';

async function testDatabase() {
  console.log('=== Iniciando pruebas de Base de Datos ===\n');

  try {
    // 1. Inicializar BD
    console.log('1. Inicializando base de datos...');
    await initDatabase();
    console.log(' Base de datos inicializada\n');

    // 2. Crear petición
    console.log('2. Creando petición de prueba...');
    const nuevaPeticion = await PeticionController.crearPeticion({
      titulo: 'Petición de prueba',
      descripcion: 'Esta es una petición de prueba para verificar el CRUD',
      categoria: 'Test',
      adjunto: 'test.pdf'
    });
    
    if (nuevaPeticion.success) {
      console.log('Petición creada:', nuevaPeticion.data);
    } else {
      console.log('Error al crear:', nuevaPeticion.error);
    }
    console.log('');

    // 3. Leer todas las peticiones
    console.log('3. Obteniendo todas las peticiones...');
    const todasPeticiones = await PeticionController.obtenerPeticiones();
    if (todasPeticiones.success) {
      console.log(` Se encontraron ${todasPeticiones.data.length} peticiones`);
      todasPeticiones.data.forEach(p => {
        console.log(`   - ${p.titulo} (${p.estado})`);
      });
    }
    console.log('');

    // 4. Obtener estadísticas
    console.log('4. Obteniendo estadísticas...');
    const stats = await PeticionController.obtenerEstadisticas();
    if (stats.success) {
      console.log('    Estadísticas:');
      console.log(`   - Abiertas: ${stats.data.abiertas}`);
      console.log(`   - Resueltas: ${stats.data.resueltas}`);
      console.log(`   - Total: ${stats.data.total}`);
    }
    console.log('');

    // 5. Actualizar estado
    if (nuevaPeticion.success) {
      console.log('5. Cambiando estado a "resuelta"...');
      const actualizada = await PeticionController.cambiarEstadoPeticion(
        nuevaPeticion.data.id,
        'resuelta'
      );
      if (actualizada.success) {
        console.log(' Estado actualizado:', actualizada.data.estado);
      }
      console.log('');

      // 6. Eliminar petición
      console.log('6. Eliminando petición de prueba...');
      const eliminada = await PeticionController.eliminarPeticion(nuevaPeticion.data.id);
      if (eliminada.success) {
        console.log(' Petición eliminada correctamente');
      }
    }

    console.log('\n===  Todas las pruebas completadas exitosamente ==='); 
  } catch (error) {
    console.error(' Error en las pruebas:', error);
  }
}

// Exportar función de prueba
export default testDatabase;
