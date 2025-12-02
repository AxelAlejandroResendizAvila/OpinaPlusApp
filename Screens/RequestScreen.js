import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert, RefreshControl } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import PeticionController from "../controllers/PeticionController";
import { useAuth } from "../context/AuthContext";

export default function RequestScreen({ navigation }) {
  const [filtro, setFiltro] = useState("Todas");
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
  const { user } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      cargarPeticiones();
    }, [])
  );

  const cargarPeticiones = async () => {
    try {
      setLoading(true);
      const resultado = await PeticionController.obtenerPeticiones();
      if (resultado.success) {
        setPeticiones(resultado.data);
        calcularEstadisticas(resultado.data);
      } else {
        Alert.alert("Error", "No se pudieron cargar las peticiones");
      }
    } catch (error) {
      console.error("Error al cargar peticiones:", error);
      Alert.alert("Error", "Ocurrió un error al cargar las peticiones");
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

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  const filtradas =
    filtro === "Todas" 
      ? peticiones 
      : peticiones.filter(p => {
          if (filtro === "Abierta") return p.estado === "abierta";
          if (filtro === "En Proceso") return p.estado === "en_proceso";
          if (filtro === "Resuelta") return p.estado === "resuelta";
          if (filtro === "Cerrada") return p.estado === "cerrada";
          return false;
        });

  const obtenerTextoEstado = (estado) => {
    switch(estado) {
      case 'abierta': return 'Abierta';
      case 'en_proceso': return 'En Proceso';
      case 'resuelta': return 'Resuelta';
      case 'cerrada': return 'Cerrada';
      default: return estado;
    }
  };

  const Item = ({ titulo, estado, fecha, categoria, item }) => (
    <TouchableOpacity 
      style={[styles.card, { borderLeftColor: estadoStyle(estado).color }]}
      onPress={() => navigation.navigate('Details', { peticionId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.titulo} numberOfLines={2}>{titulo}</Text>
        <Ionicons name={obtenerIconoEstado(estado)} size={24} color={estadoStyle(estado).color} />
      </View>
      <Text style={styles.categoria}>📁 {categoria}</Text>
      <View style={styles.row}>
        <Text style={styles.fecha}>📅 {formatearFecha(fecha)}</Text>
        <Text style={[styles.estado, estadoStyle(estado)]}>
          {obtenerTextoEstado(estado)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const obtenerIconoEstado = (estado) => {
    switch(estado) {
      case 'abierta': return 'time-outline';
      case 'en_proceso': return 'hourglass-outline';
      case 'resuelta': return 'checkmark-circle';
      case 'cerrada': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const estadoStyle = (estado) => {
    switch (estado) {
      case "abierta":
        return { color: "#2701A9" };
      case "en_proceso":
        return { color: "#FFA500" };
      case "resuelta":
        return { color: "#28a745" };
      case "cerrada":
        return { color: "#6c757d" };
      default:
        return { color: "#000" };
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Opina +</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Mis Solicitudes</Text>
          <TouchableOpacity 
            style={styles.btnNueva}
            onPress={() => navigation.navigate('Create')}
          >
            <Ionicons name="add-circle" size={24} color="#2701A9" />
          </TouchableOpacity>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{estadisticas.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statBox, { borderColor: '#2701A9' }]}>
            <Text style={[styles.statNumber, { color: '#2701A9' }]}>{estadisticas.abierta}</Text>
            <Text style={styles.statLabel}>Abiertas</Text>
          </View>
          <View style={[styles.statBox, { borderColor: '#FFA500' }]}>
            <Text style={[styles.statNumber, { color: '#FFA500' }]}>{estadisticas.en_proceso}</Text>
            <Text style={styles.statLabel}>En Proceso</Text>
          </View>
          <View style={[styles.statBox, { borderColor: '#28a745' }]}>
            <Text style={[styles.statNumber, { color: '#28a745' }]}>{estadisticas.resuelta}</Text>
            <Text style={styles.statLabel}>Resueltas</Text>
          </View>
        </View>

        {/* Filtros */}
        <View style={styles.filtros}>
          {["Todas", "Abierta", "En Proceso", "Resuelta", "Cerrada"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.filterBtn, filtro === item && styles.filterActive]}
              onPress={() => setFiltro(item)}
            >
              <Text style={[styles.filterText, filtro === item && styles.filterTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2701A9" />
            <Text style={styles.loadingText}>Cargando peticiones...</Text>
          </View>
        ) : (
          <FlatList
            data={filtradas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Item 
                titulo={item.titulo} 
                estado={item.estado} 
                fecha={item.fecha_creacion}
                categoria={item.categoria}
                item={item}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="folder-open-outline" size={60} color="#D9D9D9" />
                <Text style={styles.empty}>No hay solicitudes en esta categoría</Text>
                <TouchableOpacity 
                  style={styles.btnCrearPrimera}
                  onPress={() => navigation.navigate('Create')}
                >
                  <Text style={styles.btnCrearPrimeraText}>Crear mi primera petición</Text>
                </TouchableOpacity>
              </View>
            }
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                colors={['#2701A9']}
              />
            }
          />
        )}
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
    container: {
        backgroundColor: '#ffffff',
        width: '80%',
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
    },
    background: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#2701A9",
    },
    btnNueva: {
        padding: 5,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        gap: 8,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#2701A9',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2701A9',
    },
    statLabel: {
        fontSize: 10,
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
    filterBtn: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "#D9D9D9",
        borderRadius: 30,
        marginVertical: 4,
    },
    filterActive: {
        backgroundColor: "#2701A9",
    },
    filterText: {
        color: "#000000",
        fontSize: 12,
        fontWeight: "bold",
    },
    filterTextActive: {
        color: "#ffffff",
    },
    loadingContainer: {
        marginTop: 50,
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        color: '#2701A9',
        fontSize: 14,
    },
    card: {
        backgroundColor: "#D9D9D9",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
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
        marginBottom: 8,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        marginTop: 6,
    },
    fecha: {
        color: "#666",
        fontSize: 12,
    },
    estado: {
        fontWeight: "bold",
        fontSize: 13,
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
        fontSize: 16,
    },
    btnCrearPrimera: {
        marginTop: 20,
        backgroundColor: '#2701A9',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 30,
    },
    btnCrearPrimeraText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
