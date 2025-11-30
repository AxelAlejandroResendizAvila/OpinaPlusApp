import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from "react-native";

export default function NotificationsScreen({ navigation }) {
  
  // Cambiar entre alumno/moderador para pruebas
  const rol = "alumno"; // "moderador" o "alumno"

  const notificaciones = [
    {
      id: 1,
      mensaje: "Tu petición ha sido respondida",
      estado: "Respondida",
      fecha: "06/11/2025 • 10:12 AM",
      peticionId: 101,
      tipo: "respuesta",
    },
    {
      id: 2,
      mensaje: "Tu petición fue marcada como en proceso",
      estado: "En proceso",
      fecha: "05/11/2025 • 6:34 PM",
      peticionId: 102,
      tipo: "progreso",
    },
    {
      id: 3,
      mensaje: rol === "alumno" 
        ? "Nueva respuesta del moderador"
        : "Nueva petición asignada a tu bandeja",
      estado: rol === "alumno" ? "Nueva respuesta" : "Pendiente",
      fecha: "05/11/2025 • 1:40 PM",
      peticionId: 103,
      tipo: rol === "alumno" ? "mensaje" : "asignacion",
    },
  ];

  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Opina +</Text>
      </View>
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>
      <ScrollView>

        {notificaciones.map((n) => (
          <View key={n.id} style={styles.card}>
            
            <Text style={styles.msg}>{n.mensaje}</Text>
            <Text style={styles.estado}>
              Estado: <Text style={styles.bold}>{n.estado}</Text>
            </Text>
            <Text style={styles.fecha}>{n.fecha}</Text>

            <TouchableOpacity style={styles.btn}>
              <Text style={styles.btnText}>Ver petición #{n.peticionId}</Text>
            </TouchableOpacity>
          </View>
        ))}

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
  estado: {
    color: "#000000",
    fontSize: 13,
    marginBottom: 4,
  },
  bold: {
    color: "#2701A9",
    fontWeight: "bold",
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
