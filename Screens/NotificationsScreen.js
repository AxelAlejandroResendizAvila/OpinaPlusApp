import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import PeticionController from "../controllers/PeticionController";
import { useAuth } from "../context/AuthContext";

export default function NotificationsScreen({ navigation }) {
  const [peticiones, setPeticiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const cargarPeticiones = async () => {
    try {
      setLoading(true);
      const resultado = await PeticionController.obtenerPeticiones();
      
      if (resultado.success) {
        // Ordenar por fecha de actualización (más recientes primero)
        const peticionesOrdenadas = resultado.data.sort((a, b) => {
          const fechaA = new Date(a.fecha_actualizacion || a.fecha_creacion);
          const fechaB = new Date(b.fecha_actualizacion || b.fecha_creacion);
          return fechaB - fechaA;
        });
        setPeticiones(peticionesOrdenadas);
      }
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarPeticiones();
    setRefreshing(false);
  };

  useEffect(() => {
    cargarPeticiones();
  }, []);

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const año = date.getFullYear();
    const horas = date.getHours().toString().padStart(2, '0');
    const minutos = date.getMinutes().toString().padStart(2, '0');
    return `${dia}/${mes}/${año} • ${horas}:${minutos}`;
  };

  const obtenerMensajeNotificacion = (peticion) => {
    switch(peticion.estado) {
      case 'abierta':
        return 'Tu petición está pendiente de revisión';
      case 'en_proceso':
        return 'Tu petición está siendo procesada';
      case 'resuelta':
        return 'Tu petición ha sido resuelta';
      case 'cerrada':
        return 'Tu petición ha sido cerrada';
      default:
        return 'Actualización en tu petición';
    }
  };

  const obtenerColorEstado = (estado) => {
    switch(estado) {
      case 'abierta': return '#2701A9';
      case 'en_proceso': return '#FFA500';
      case 'resuelta': return '#28a745';
      case 'cerrada': return '#6c757d';
      default: return '#2701A9';
    }
  };

  const verDetalle = (peticion) => {
    if (navigation) {
      navigation.navigate('Details', { peticionId: peticion.id });
    }
  };

  if (loading) {
    return (
      <View style={[styles.background, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#2701A9" />
        <Text style={{ marginTop: 10, color: '#2701A9' }}>Cargando notificaciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Opina +</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Notificaciones</Text>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2701A9']} />
          }
        >
          {peticiones.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay notificaciones</Text>
            </View>
          ) : (
            peticiones.map((peticion) => (
              <View key={peticion.id} style={[styles.card, { borderLeftColor: obtenerColorEstado(peticion.estado) }]}>
                <Text style={styles.msg}>{obtenerMensajeNotificacion(peticion)}</Text>
                <Text style={styles.titulo}>{peticion.titulo}</Text>
                <Text style={styles.estado}>
                  Estado: <Text style={[styles.bold, { color: obtenerColorEstado(peticion.estado) }]}>
                    {peticion.estado.replace('_', ' ').toUpperCase()}
                  </Text>
                </Text>
                <Text style={styles.fecha}>
                  {formatearFecha(peticion.fecha_actualizacion || peticion.fecha_creacion)}
                </Text>

                <TouchableOpacity 
                  style={styles.btn}
                  onPress={() => verDetalle(peticion)}
                >
                  <Text style={styles.btnText}>Ver petición #{peticion.id}</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
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
  title: {
    color: "#2701A9",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#D9D9D9",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#2701A9",
  },
  msg: {
    color: "#000000",
    fontSize: 15,
    marginBottom: 6,
    fontWeight: "bold",
  },
  titulo: {
    color: "#2701A9",
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "600",
  },
  estado: {
    color: "#000000",
    fontSize: 13,
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#2701A9',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  fecha: {
    color: "#666",
    fontSize: 12,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#2701A9",
    padding: 10,
    borderRadius: 30,
  },
  btnText: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
  },
});
