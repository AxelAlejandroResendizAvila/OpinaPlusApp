import { View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import PeticionController from "../controllers/PeticionController";
import { useAuth } from "../context/AuthContext";

export default function HomeUserScreen({ navigation }) {

  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [estadisticas, setEstadisticas] = useState({ abiertas: 0, resueltas: 0 });
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      cargarEstadisticas();
    }, [])
  );

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const resultado = await PeticionController.obtenerEstadisticas();
      if (resultado.success) {
        setEstadisticas(resultado.data);
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  return (
        <View
          style={styles.container}
        >
          <View style={styles.headerContainer}>
                  <Text style={styles.headerText}>Opina +</Text>
                  <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                    <Ionicons name="log-out-outline" size={24} color="#2701A9" />
                  </TouchableOpacity>
                </View>
          <Text style={styles.titulo}>Bienvenido, {user?.nombre || 'Usuario'}</Text>

          <Animated.View style={[styles.cardsContainer, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Request')}>
              <Ionicons name="folder-open" size={40} color="#5170ff" />
              <Text style={styles.subtitulo}>Peticiones Abiertas</Text>
              {loading ? (
                <ActivityIndicator color="#2701A9" />
              ) : (
                <Text style={styles.numero}>{estadisticas.abiertas}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Request')}>
              <Ionicons name="checkmark-circle" size={40} color="#2cbb77" />
              <Text style={styles.subtitulo}>Peticiones Resueltas</Text>
              {loading ? (
                <ActivityIndicator color="#2701A9" />
              ) : (
                <Text style={styles.numero}>{estadisticas.resueltas}</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={styles.btnPrincipal}
            onPress={() => navigation.navigate("Create")}
          >
            <Text style={styles.btnText}>+ Crear Petición</Text>
          </TouchableOpacity>
        </View>
      );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2701A9",
  },
  logoutBtn: {
    padding: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 25,
    paddingTop: 60,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2701A9",
    marginBottom: 25,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#D9D9D9",
    width: "48%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff81",
  },
  subtitulo: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 6,
    fontWeight: "bold",
  },
  numero: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2701A9",
  },
  btnPrincipal: {
    backgroundColor: "#2701A9",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
