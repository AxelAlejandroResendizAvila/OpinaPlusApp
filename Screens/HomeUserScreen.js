import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Animated } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import CreateScreen from "./CreateScreen";
import RequestScreen from "./RequestScreen";
import DetailsScreen from "./DetailsScreen";
import NotificationsScreen from "./NotificationsScreen";

export default function HomeUserScreen() {

  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [screen, setScreen] = useState(null);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, []);

  // Navegación por estados
  switch (screen) {

    case "Create":
      return <CreateScreen />;

    case "Request":
      return <RequestScreen />;

    case "Details":
      return <DetailsScreen />;

    case "Notifications":
      return <NotificationsScreen />;

    default:
      return (
        <ImageBackground
          source={require("../assets/BG2.png")}
          style={styles.container}
        >
          <Text style={styles.titulo}>Bienvenido</Text>

          <Animated.View style={[styles.cardsContainer, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.card}>
              <Text style={styles.subtitulo}>Peticiones Abiertas</Text>
              <Text style={styles.numero}>4</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.subtitulo}>Peticiones Resueltas</Text>
              <Text style={styles.numero}>12</Text>
            </View>
          </Animated.View>

          <TouchableOpacity
            style={styles.btnPrincipal}
            onPress={() => setScreen("Create")}
          >
            <Text style={styles.btnText}>+ Crear Nueva Petición</Text>
          </TouchableOpacity>

          <View style={styles.accesos}>
            <TouchableOpacity
              style={styles.btnAcceso}
              onPress={() => setScreen("Request")}
            >
              <Text style={styles.accesoText}>📋 Ver mis peticiones</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnAcceso}
              onPress={() => setScreen("Details")}
            >
              <Text style={styles.accesoText}>📄 Ver detalle de petición</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnAcceso}
              onPress={() => setScreen("Notifications")}
            >
              <Text style={styles.accesoText}>🔔 Notificaciones</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1b1bd9",
    padding: 25,
    paddingTop: 60,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#5170ff",
    marginBottom: 25,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#ffffff15",
    width: "48%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    borderColor: "#fff5",
    borderWidth: 1,
  },
  subtitulo: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 6,
  },
  numero: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#5170ff",
  },
  btnPrincipal: {
    backgroundColor: "#5170ff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 30,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  accesos: {
    gap: 10,
  },
  btnAcceso: {
    backgroundColor: "#00000070",
    padding: 15,
    borderRadius: 10,
  },
  accesoText: {
    color: "#fff",
    fontSize: 16,
  },
});
