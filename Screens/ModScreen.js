import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import PeticionController from '../controllers/PeticionController';

export default function ModScreen({ navigation }) {
  const [filtro, setFiltro] = useState("todas");
  const [peticiones, setPeticiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    abierta: 0,
    en_proceso: 0,
    resuelta: 0,
    cerrada: 0
  });

  useEffect(() => {
    cargarPeticiones();
  }, []);

  const cargarPeticiones = async () => {
    try {
      setLoading(true);
      const resultado = await PeticionController.obtenerTodasPeticiones();
      
      if (resultado.exito) {
        setPeticiones(resultado.data);
        calcularEstadisticas(resultado.data);
      } else {
        Alert.alert('Error', resultado.mensaje);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las peticiones');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarPeticiones();
    setRefreshing(false);
  };

  const calcularEstadisticas = (data) => {
    const stats = {
      total: data.length,
      abierta: data.filter(p => p.estado === 'abierta').length,
      en_proceso: data.filter(p => p.estado === 'en_proceso').length,
      resuelta: data.filter(p => p.estado === 'resuelta').length,
      cerrada: data.filter(p => p.estado === 'cerrada').length
    };
    setEstadisticas(stats);
  };

  const cambiarEstadoPeticion = async (peticionId, nuevoEstado) => {
    Alert.alert(
      'Cambiar Estado',
      `¿Deseas cambiar el estado a "${nuevoEstado}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              const resultado = await PeticionController.actualizarEstado(peticionId, nuevoEstado);
              if (resultado.exito) {
                Alert.alert('Éxito', 'Estado actualizado correctamente');
                await cargarPeticiones();
              } else {
                Alert.alert('Error', resultado.mensaje);
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudo actualizar el estado');
            }
          }
        }
      ]
    );
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  const obtenerColorEstado = (estado) => {
    switch(estado) {
      case 'abierta': return '#2701A9';
      case 'en_proceso': return '#FFA500';
      case 'resuelta': return '#28a745';
      case 'cerrada': return '#6c757d';
      default: return '#666';
    }
  };

  const obtenerIconoEstado = (estado) => {
    switch(estado) {
      case 'abierta': return 'mail-unread-outline';
      case 'en_proceso': return 'sync-outline';
      case 'resuelta': return 'checkmark-circle-outline';
      case 'cerrada': return 'close-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  const filtradas = filtro === 'todas' 
    ? peticiones 
    : peticiones.filter(p => p.estado === filtro);

  const cambiarFiltro = (estado) => setFiltro(estado);

  const renderItem = ({ item }) => {
    const colorEstado = obtenerColorEstado(item.estado);
    const iconoEstado = obtenerIconoEstado(item.estado);

    return (
      <TouchableOpacity 
        style={[styles.card, { borderLeftColor: colorEstado }]}
        onPress={() => navigation.navigate('Details', { peticionId: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.titulo}>{item.titulo}</Text>
          <Ionicons name={iconoEstado} size={24} color={colorEstado} />
        </View>

        {item.categoria && (
          <Text style={styles.categoria}>📁 {item.categoria}</Text>
        )}

        <Text style={styles.detalle}>👤 Usuario ID: {item.usuario_id}</Text>
        
        <View style={styles.row}>
          <Text style={styles.fecha}>📅 {formatearFecha(item.fecha_creacion)}</Text>
          <Text style={[styles.estadoText, { color: colorEstado }]}>
            {item.estado.replace('_', ' ').toUpperCase()}
          </Text>
        </View>

        <View style={styles.botones}>
          {item.estado === 'abierta' && (
            <TouchableOpacity 
              style={[styles.btn, { backgroundColor: '#FFA500' }]} 
              onPress={(e) => {
                e.stopPropagation();
                cambiarEstadoPeticion(item.id, 'en_proceso');
              }}
            >
              <Ionicons name="sync-outline" size={16} color="#fff" />
              <Text style={styles.btnText}> En Proceso</Text>
            </TouchableOpacity>
          )}

          {item.estado === 'en_proceso' && (
            <TouchableOpacity 
              style={[styles.btn, { backgroundColor: '#28a745' }]} 
              onPress={(e) => {
                e.stopPropagation();
                cambiarEstadoPeticion(item.id, 'resuelta');
              }}
            >
              <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
              <Text style={styles.btnText}> Resolver</Text>
            </TouchableOpacity>
          )}

          {(item.estado === 'resuelta' || item.estado === 'abierta') && (
            <TouchableOpacity 
              style={[styles.btnSecondary, { backgroundColor: '#6c757d' }]} 
              onPress={(e) => {
                e.stopPropagation();
                cambiarEstadoPeticion(item.id, 'cerrada');
              }}
            >
              <Ionicons name="close-circle-outline" size={16} color="#fff" />
              <Text style={styles.btnText}> Cerrar</Text>
            </TouchableOpacity>
          )}

          {item.estado === 'en_proceso' && (
            <TouchableOpacity 
              style={[styles.btnSecondary, { backgroundColor: '#2701A9' }]} 
              onPress={(e) => {
                e.stopPropagation();
                cambiarEstadoPeticion(item.id, 'abierta');
              }}
            >
              <Ionicons name="arrow-back-outline" size={16} color="#fff" />
              <Text style={styles.btnText}> Reabrir</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.background}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Opina +</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2701A9" />
          <Text style={styles.loadingText}>Cargando peticiones...</Text>
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
        <Text style={styles.header}>Gestión de Peticiones</Text>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{estadisticas.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#2701A9' }]}>{estadisticas.abierta}</Text>
            <Text style={styles.statLabel}>Abiertas</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#FFA500' }]}>{estadisticas.en_proceso}</Text>
            <Text style={styles.statLabel}>En Proceso</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#28a745' }]}>{estadisticas.resuelta}</Text>
            <Text style={styles.statLabel}>Resueltas</Text>
          </View>
        </View>

        {/* Filtros */}
        <View style={styles.filtros}>
          <TouchableOpacity 
            style={[styles.filtroBtn, filtro === "todas" && styles.filtroActivo]}
            onPress={() => cambiarFiltro("todas")}
          >
            <Text style={[styles.filtroText, filtro === "todas" && styles.filtroTextoActivo]}>
              Todas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.filtroBtn, filtro === "abierta" && styles.filtroActivo]}
            onPress={() => cambiarFiltro("abierta")}
          >
            <Text style={[styles.filtroText, filtro === "abierta" && styles.filtroTextoActivo]}>
              Abiertas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.filtroBtn, filtro === "en_proceso" && styles.filtroActivo]}
            onPress={() => cambiarFiltro("en_proceso")}
          >
            <Text style={[styles.filtroText, filtro === "en_proceso" && styles.filtroTextoActivo]}>
              En Proceso
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.filtroBtn, filtro === "resuelta" && styles.filtroActivo]}
            onPress={() => cambiarFiltro("resuelta")}
          >
            <Text style={[styles.filtroText, filtro === "resuelta" && styles.filtroTextoActivo]}>
              Resueltas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.filtroBtn, filtro === "cerrada" && styles.filtroActivo]}
            onPress={() => cambiarFiltro("cerrada")}
          >
            <Text style={[styles.filtroText, filtro === "cerrada" && styles.filtroTextoActivo]}>
              Cerradas
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filtradas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2701A9']} />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={64} color="#ccc" />
              <Text style={styles.empty}>No hay peticiones {filtro !== 'todas' ? `en estado "${filtro}"` : ''}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  background: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    backgroundColor: '#ffffff',
    width: '90%',
    padding: 20,
    borderRadius: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    flex: 1,
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2701A9",
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 6,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2701A9',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2701A9',
  },
  statLabel: {
    fontSize: 9,
    color: '#666',
    marginTop: 2,
  },
  filtros: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    flexWrap: "wrap",
    gap: 5,
  },
  filtroBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#D9D9D9",
    borderRadius: 30,
  },
  filtroActivo: {
    backgroundColor: "#2701A9",
  },
  filtroText: {
    color: "#000",
    fontSize: 11,
    fontWeight: "bold",
  },
  filtroTextoActivo: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 2,
    borderColor: "#ffffff81",
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titulo: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  categoria: {
    color: "#666",
    fontSize: 13,
    marginBottom: 6,
  },
  detalle: {
    color: "#000000",
    fontSize: 13,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  fecha: {
    color: "#666",
    fontSize: 12,
  },
  estadoText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  botones: {
    flexDirection: "row",
    marginTop: 10,
    gap: 8,
    flexWrap: 'wrap',
  },
  btn: {
    backgroundColor: "#2701A9",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: "center",
    flex: 1,
    justifyContent: 'center',
    minWidth: 100,
  },
  btnSecondary: {
    backgroundColor: "#6c757d",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: "center",
    flex: 1,
    justifyContent: 'center',
    minWidth: 100,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  empty: {
    color: "#666",
    textAlign: "center",
    marginTop: 15,
    fontSize: 14,
  },
});
