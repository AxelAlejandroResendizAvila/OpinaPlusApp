import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import PeticionController from '../controllers/PeticionController';
import MLController from '../controllers/MLController';
import { getDatabase } from '../database/database';

export default function HomeAdminScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    resueltas: 0,
    enProceso: 0,
    abiertas: 0,
    cerradas: 0
  });
  const [tiempoPromedio, setTiempoPromedio] = useState("N/A");
  const [mlInsights, setMlInsights] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState(false);
  const [peticionesData, setPeticionesData] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const resultado = await PeticionController.obtenerTodasPeticiones();
      
      console.log(' DEBUG - Resultado completo:', resultado);
      
      if (resultado.exito) {
        const peticiones = resultado.data;
        console.log(' DEBUG - Total peticiones recibidas:', peticiones.length);
        console.log(' DEBUG - Primeras 3 peticiones:', peticiones.slice(0, 3));
        setPeticionesData(peticiones);
        calcularEstadisticas(peticiones);
        calcularTiempoPromedio(peticiones);
        
        // Cargar insights ML con las peticiones
        await cargarInsightsML(peticiones);
      } else {
        console.log('DEBUG - Error al obtener peticiones:', resultado.mensaje);
      }
    } catch (error) {
      console.error(' Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarDatos();
    setRefreshing(false);
  };

  const cargarInsightsML = async (peticiones) => {
    try {
      setMlLoading(true);
      setMlError(false);
      
      console.log(' Enviando', peticiones.length, 'peticiones al ML backend');
      console.log('Primera petición ejemplo:', JSON.stringify(peticiones[0], null, 2));
      
      const resultado = await MLController.obtenerInsights(peticiones);
      
      console.log(' Respuesta ML:', resultado);
      
      if (resultado.exito) {
        setMlInsights(resultado);
      } else {
        setMlError(true);
        console.log('ML API no disponible:', resultado.mensaje);
      }
    } catch (error) {
      setMlError(true);
      console.log('Error conectando con ML:', error);
    } finally {
      setMlLoading(false);
    }
  };

  const crearPeticionesPrueba = async () => {
    Alert.alert(
      "Crear Datos de Prueba",
      "¿Quieres crear 30 peticiones de prueba para demostrar el ML?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Crear", 
          onPress: async () => {
            try {
              const db = getDatabase();
              
              const peticiones = [
                // NEGATIVAS
                ["WiFi no funciona en edificio A", "El internet está muy lento y se desconecta constantemente.", "Infraestructura", "abierta"],
                ["Baños sucios en planta baja", "Los baños del primer piso están en pésimas condiciones.", "Limpieza", "abierta"],
                ["Aire acondicionado roto", "El clima del salón 203 no funciona, hace mucho calor.", "Mantenimiento", "en_proceso"],
                ["Falta de estacionamiento", "No hay lugares suficientes para estacionar.", "Infraestructura", "abierta"],
                ["Laboratorio sin equipo", "El laboratorio de cómputo tiene muchas computadoras dañadas.", "Equipamiento", "abierta"],
                ["Falta iluminación en estacionamiento", "El estacionamiento está muy oscuro por las noches.", "Seguridad", "abierta"],
                ["Problema con impresoras", "Las impresoras del centro de cómputo siempre tienen fallas.", "Equipamiento", "abierta"],
                ["Agua fría en bebederos", "Los bebederos del edificio B no tienen agua fría.", "Mantenimiento", "abierta"],
                ["Jardines descuidados", "Los jardines de la entrada están descuidados y con basura.", "Mantenimiento", "abierta"],
                ["Bancas rotas en explanada", "Varias bancas están rotas en la explanada principal.", "Mantenimiento", "abierta"],
                
                // NEUTRALES
                ["Información sobre horarios", "Solicito información sobre los horarios de la biblioteca.", "Información", "abierta"],
                ["Consulta de trámites", "Necesito saber qué documentos requiero para el trámite.", "Administrativo", "en_proceso"],
                ["Acceso a plataforma", "Solicito acceso a la plataforma de cursos en línea.", "Tecnología", "abierta"],
                ["Solicitud de nuevo software", "Solicito la instalación de software actualizado.", "Tecnología", "en_proceso"],
                ["Actualización sistema", "El sistema de inscripciones necesita actualización.", "Tecnología", "en_proceso"],
                
                // POSITIVAS
                ["Excelente atención en biblioteca", "Agradezco la excelente atención del personal de biblioteca.", "Reconocimiento", "resuelta"],
                ["Gracias por reparar proyector", "Muchas gracias por arreglar el proyector del salón 105.", "Agradecimiento", "resuelta"],
                ["Cafetería limpia y ordenada", "La cafetería está muy limpia y el servicio es rápido.", "Reconocimiento", "resuelta"],
                ["Felicidades por evento", "Excelente organización del evento cultural.", "Reconocimiento", "resuelta"],
                ["Buen servicio médico", "Agradezco la atención en el servicio médico.", "Reconocimiento", "resuelta"],
                ["Gracias por arreglar clima", "El aire acondicionado ya funciona perfecto.", "Agradecimiento", "resuelta"],
                ["Biblioteca mejorada", "Las nuevas instalaciones de la biblioteca son excelentes.", "Reconocimiento", "resuelta"],
                ["Personal muy amable", "El personal administrativo es muy amable.", "Reconocimiento", "resuelta"],
                
                // MÁS VARIEDAD
                ["Señalización confusa", "Las señales del edificio nuevo son confusas.", "Infraestructura", "abierta"],
                ["Propuesta de mejora", "Sugiero instalar más enchufes en la biblioteca.", "Sugerencia", "abierta"],
                ["Problemas con red", "La red de la escuela bloquea muchas páginas.", "Tecnología", "en_proceso"],
                ["Horarios de cafetería", "Los horarios de la cafetería son muy limitados.", "Servicios", "abierta"],
                ["Áreas verdes bonitas", "Me encantan las nuevas áreas verdes.", "Reconocimiento", "resuelta"],
                ["Falta seguridad", "Se necesita más vigilancia en las áreas de estacionamiento.", "Seguridad", "abierta"],
                ["Gracias por resolver", "Gracias por resolver rápido el problema del agua.", "Agradecimiento", "resuelta"],
              ];
              
              for (const [titulo, descripcion, categoria, estado] of peticiones) {
                const diasAtras = Math.floor(Math.random() * 30);
                const fecha = new Date();
                fecha.setDate(fecha.getDate() - diasAtras);
                
                await db.runAsync(
                  'INSERT INTO peticiones (titulo, descripcion, categoria, estado, fecha_creacion, usuario_id) VALUES (?, ?, ?, ?, ?, ?)',
                  [titulo, descripcion, categoria, estado, fecha.toISOString(), 1]
                );
              }
              
              Alert.alert("Éxito", "Se crearon 30 peticiones de prueba");
              await cargarDatos();
            } catch (error) {
              console.error('Error creando peticiones:', error);
              Alert.alert("Error", "No se pudieron crear las peticiones: " + error.message);
            }
          }
        }
      ]
    );
  };

  const calcularEstadisticas = (peticiones) => {
    const stats = {
      total: peticiones.length,
      resueltas: peticiones.filter(p => p.estado === 'resuelta').length,
      enProceso: peticiones.filter(p => p.estado === 'en_proceso').length,
      abiertas: peticiones.filter(p => p.estado === 'abierta').length,
      cerradas: peticiones.filter(p => p.estado === 'cerrada').length
    };
    setEstadisticas(stats);
  };

  const calcularTiempoPromedio = (peticiones) => {
    const peticionesResueltas = peticiones.filter(p => 
      (p.estado === 'resuelta' || p.estado === 'cerrada') && p.fecha_creacion
    );

    if (peticionesResueltas.length === 0) {
      setTiempoPromedio("N/A");
      return;
    }

    let totalDias = 0;
    peticionesResueltas.forEach(p => {
      const fechaCreacion = new Date(p.fecha_creacion);
      const fechaActual = new Date();
      const diferenciaDias = Math.floor((fechaActual - fechaCreacion) / (1000 * 60 * 60 * 24));
      totalDias += diferenciaDias;
    });

    const promedio = (totalDias / peticionesResueltas.length).toFixed(1);
    setTiempoPromedio(`${promedio} días`);
  };

  const porcentajeResueltas = estadisticas.total > 0 
    ? Math.round((estadisticas.resueltas / estadisticas.total) * 100) 
    : 0;
  const porcentajeProceso = estadisticas.total > 0 
    ? Math.round((estadisticas.enProceso / estadisticas.total) * 100) 
    : 0;
  const porcentajeAbiertas = estadisticas.total > 0 
    ? Math.round((estadisticas.abiertas / estadisticas.total) * 100) 
    : 0;
  const porcentajeCerradas = estadisticas.total > 0 
    ? Math.round((estadisticas.cerradas / estadisticas.total) * 100) 
    : 0;

  const Barra = ({ porcentaje, color }) => (
    <View style={styles.barraCont}>
      <View style={[styles.barra, { width: `${porcentaje}%`, backgroundColor: color }]} />
      <Text style={styles.barraTexto}>{porcentaje}%</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.background}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Opina +</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2701A9" />
          <Text style={styles.loadingText}>Cargando dashboard...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Opina +</Text>
      </View>
      <View style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2701A9']} />
          }
        >
          <Text style={styles.titulo}>Dashboard Administrador</Text>

         

      {/* KPIs */}
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.num}>{estadisticas.total}</Text>
          <Text style={styles.label}>Total Peticiones</Text>
        </View>

        <View style={styles.card}>
          <Text style={[styles.num, { color: '#28a745' }]}>{estadisticas.resueltas}</Text>
          <Text style={styles.label}>Resueltas</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={[styles.num, { color: '#FFA500' }]}>{estadisticas.enProceso}</Text>
          <Text style={styles.label}>En Proceso</Text>
        </View>

        <View style={styles.card}>
          <Text style={[styles.num, { color: '#2701A9' }]}>{estadisticas.abiertas}</Text>
          <Text style={styles.label}>Abiertas</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={[styles.num, { color: '#6c757d' }]}>{estadisticas.cerradas}</Text>
          <Text style={styles.label}>Cerradas</Text>
        </View>

        <View style={styles.card}>
          <Text style={[styles.num, { fontSize: 20 }]}>{tiempoPromedio}</Text>
          <Text style={styles.label}>Tiempo Promedio</Text>
        </View>
      </View>

      {/* Gráficos simples */}
      <Text style={styles.subtitle}>Proporción de estados</Text>

      <Text style={styles.chartLabel}>Resueltas ({estadisticas.resueltas})</Text>
      <Barra porcentaje={porcentajeResueltas} color="#28a745" />

      <Text style={styles.chartLabel}>En Proceso ({estadisticas.enProceso})</Text>
      <Barra porcentaje={porcentajeProceso} color="#FFA500" />

      <Text style={styles.chartLabel}>Abiertas ({estadisticas.abiertas})</Text>
      <Barra porcentaje={porcentajeAbiertas} color="#2701A9" />

      <Text style={styles.chartLabel}>Cerradas ({estadisticas.cerradas})</Text>
      <Barra porcentaje={porcentajeCerradas} color="#6c757d" />

      {/* Sección Machine Learning */}
      <Text style={styles.subtitle}> Modelo ml </Text>

      {mlLoading && (
        <View style={styles.mlLoadingContainer}>
          <ActivityIndicator size="small" color="#2701A9" />
          <Text style={styles.mlLoadingText}>Cargando análisis ML...</Text>
        </View>
      )}

      {mlError && !mlLoading && (
        <View style={styles.cardMLError}>
          <Ionicons name="alert-circle-outline" size={24} color="#e63946" />
          <Text style={styles.mlErrorText}>
            Backend ML no disponible. Ejecuta: cd backend-ml && python app.py
          </Text>
        </View>
      )}

      {mlInsights && !mlLoading && !mlError && (
        <>
          {/* Predicción de Volumen */}
          <View style={styles.cardML}>
            <View style={styles.mlHeader}>
              <Ionicons name="trending-up" size={24} color="#2701A9" />
              <Text style={styles.mlTitulo}>Predicción de Volumen</Text>
            </View>
            <Text style={styles.mlTexto}>
              Próximos 7 días: ~{mlInsights.volumen_predicho.promedio_predicho} peticiones/día
            </Text>
            <Text style={styles.mlSubtexto}>
              Rango: {mlInsights.volumen_predicho.minimo} - {mlInsights.volumen_predicho.maximo} peticiones
            </Text>
            {mlInsights.volumen_predicho.total_predicho && (
              <Text style={styles.mlSubtexto}>
                Total estimado: {mlInsights.volumen_predicho.total_predicho} peticiones
              </Text>
            )}
            <Text style={styles.mlMetodo}>
              Método: {mlInsights.volumen_predicho.metodo === 'prophet' ? '📊 Prophet (IA)' : '📈 Promedio histórico'}
            </Text>
          </View>

          {/* Análisis de Sentimiento */}
          <View style={styles.cardML}>
            <View style={styles.mlHeader}>
              <Ionicons name="happy-outline" size={24} color="#2701A9" />
              <Text style={styles.mlTitulo}>Análisis de Sentimiento</Text>
            </View>
            
            <View style={styles.sentimentRow}>
              <View style={styles.sentimentItem}>
                <Ionicons name="happy" size={20} color="#28a745" />
                <Text style={[styles.sentimentText, { color: '#28a745' }]}>
                  {mlInsights.sentimiento.positivos} ({mlInsights.sentimiento.porcentaje_positivos}%)
                </Text>
              </View>
              
              <View style={styles.sentimentItem}>
                <Ionicons name="remove-circle" size={20} color="#FFA500" />
                <Text style={[styles.sentimentText, { color: '#FFA500' }]}>
                  {mlInsights.sentimiento.neutrales} ({mlInsights.sentimiento.porcentaje_neutrales}%)
                </Text>
              </View>
              
              <View style={styles.sentimentItem}>
                <Ionicons name="sad" size={20} color="#e63946" />
                <Text style={[styles.sentimentText, { color: '#e63946' }]}>
                  {mlInsights.sentimiento.negativos} ({mlInsights.sentimiento.porcentaje_negativos}%)
                </Text>
              </View>
            </View>

            <Text style={styles.mlSubtexto}>
              Total analizado: {mlInsights.sentimiento.total} peticiones
            </Text>
            <Text style={styles.mlSubtexto}>
              Confianza promedio: {(mlInsights.sentimiento.confianza_promedio * 100).toFixed(1)}%
            </Text>
          </View>

          {/* Recomendaciones */}
          {mlInsights.recomendaciones && mlInsights.recomendaciones.length > 0 && (
            <View style={styles.recomendacionesContainer}>
              <Text style={styles.recomendacionesTitulo}>💡 Recomendaciones</Text>
              {mlInsights.recomendaciones.map((rec, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.recomendacion,
                    rec.tipo === 'alerta' && styles.recomendacionAlerta,
                    rec.tipo === 'exito' && styles.recomendacionExito,
                  ]}
                >
                  <Ionicons 
                    name={
                      rec.tipo === 'alerta' ? 'alert-circle' : 
                      rec.tipo === 'exito' ? 'checkmark-circle' : 
                      'information-circle'
                    } 
                    size={18} 
                    color={
                      rec.tipo === 'alerta' ? '#e63946' : 
                      rec.tipo === 'exito' ? '#28a745' : 
                      '#2701A9'
                    } 
                  />
                  <Text style={styles.recomendacionTexto}>{rec.mensaje}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}

      {!mlInsights && !mlLoading && !mlError && (
        <View style={styles.cardML}>
          <Text style={styles.mlTitulo}>⚙️ Configuración Requerida</Text>
          <Text style={styles.mlTexto}>
            Para activar Machine Learning, inicia el backend Python:
          </Text>
          <Text style={styles.mlCode}>cd backend-ml && python app.py</Text>
          <Text style={styles.mlSubtexto}>
            Ver GUIA_ML.md para más información
          </Text>
        </View>
      )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    width: '100%',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2701A9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#2701A9',
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 15,
  },
  titulo: {
    color: "#2701A9",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#D9D9D9",
    width: "48%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#ffffff81",
  },
  cardLarge: {
    backgroundColor: "#D9D9D9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: "#ffffff81",
  },
  num: {
    color: "#2701A9",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    color: "#000000",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
  subtitle: {
    color: "#2701A9",
    fontSize: 18,
    marginTop: 18,
    marginBottom: 8,
    fontWeight: "bold",
  },
  chartLabel: {
    color: "#000000",
    fontSize: 13,
    marginTop: 8,
  },
  barraCont: {
    height: 20,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    marginVertical: 4,
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff81",
  },
  barra: {
    height: "100%",
    borderRadius: 8,
  },
  barraTexto: {
    position: "absolute",
    alignSelf: "center",
    color: "#000000",
    fontSize: 11,
    fontWeight: "bold",
  },
  cardML: {
    backgroundColor: "#D9D9D9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#2701A9",
    borderWidth: 2,
    borderColor: "#ffffff81",
  },
  cardMLError: {
    backgroundColor: "#ffe5e5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#e63946",
    borderWidth: 2,
    borderColor: "#ffffff81",
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mlLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10,
  },
  mlLoadingText: {
    color: '#2701A9',
    fontSize: 13,
  },
  mlErrorText: {
    color: "#e63946",
    fontSize: 12,
    flex: 1,
  },
  mlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  mlTitulo: {
    color: "#2701A9",
    fontSize: 15,
    fontWeight: "bold",
  },
  mlTexto: {
    color: "#000000",
    fontSize: 13,
    marginBottom: 4,
  },
  mlSubtexto: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
  },
  mlMetodo: {
    color: "#2701A9",
    fontSize: 11,
    marginTop: 8,
    fontStyle: 'italic',
  },
  mlCode: {
    backgroundColor: "#000",
    color: "#0f0",
    padding: 8,
    borderRadius: 5,
    fontFamily: 'monospace',
    fontSize: 11,
    marginVertical: 8,
  },
  sentimentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  sentimentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sentimentText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  recomendacionesContainer: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#ffffff81",
  },
  recomendacionesTitulo: {
    color: "#2701A9",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },
  recomendacion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#2701A9",
  },
  recomendacionAlerta: {
    backgroundColor: '#fff5f5',
    borderLeftColor: "#e63946",
  },
  recomendacionExito: {
    backgroundColor: '#f0fff4',
    borderLeftColor: "#28a745",
  },
  recomendacionTexto: {
    color: "#000",
    fontSize: 12,
    flex: 1,
  },
  btnDebug: {
    backgroundColor: '#ff6b6b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#ff5252',
  },
  btnDebugText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
