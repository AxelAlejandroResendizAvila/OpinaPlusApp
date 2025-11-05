import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity } from "react-native";

export default function ModScreen() {
  const [filtro, setFiltro] = useState("pendiente");

  const peticiones = [
    { id: "1", titulo: "Problema con WiFi", estado: "pendiente", alumno: "Luis", fecha: "01/11/2024" },
    { id: "2", titulo: "Aula sin aire", estado: "en proceso", alumno: "María", fecha: "02/11/2024" },
    { id: "3", titulo: "Ruido en biblioteca", estado: "respondida", alumno: "Carlos", fecha: "02/11/2024" },
  ];

  const filtradas = peticiones.filter(p => p.estado === filtro);

  const cambiarFiltro = (estado) => setFiltro(estado);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.titulo}>{item.titulo}</Text>
      <Text style={styles.detalle}>Alumno: {item.alumno}</Text>
      <Text style={styles.detalle}>Fecha: {item.fecha}</Text>
      <Text style={[styles.estado, 
        item.estado === "pendiente" && styles.pendiente,
        item.estado === "en proceso" && styles.proceso,
        item.estado === "respondida" && styles.respondida
      ]}>
        {item.estado.toUpperCase()}
      </Text>

      <View style={styles.botones}>
        <TouchableOpacity style={styles.btn} onPress={() => alert("Responder a: " + item.titulo)}>
          <Text style={styles.btnText}>Responder</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnReasignar} onPress={() => alert("Reasignar: " + item.titulo)}>
          <Text style={styles.btnText}>Reasignar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require("../assets/BG2.png")}
      resizeMode='cover'
      style={styles.background}
      >
        <View style={styles.container}>
      <Text style={styles.header}>Bandeja del Moderador</Text>

      <View style={styles.filtros}>
        <TouchableOpacity onPress={() => cambiarFiltro("pendiente")}>
          <Text style={[styles.filtro, filtro === "pendiente" && styles.filtroActivo]}>Pendientes</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => cambiarFiltro("en proceso")}>
          <Text style={[styles.filtro, filtro === "en proceso" && styles.filtroActivo]}>En Proceso</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => cambiarFiltro("respondida")}>
          <Text style={[styles.filtro, filtro === "respondida" && styles.filtroActivo]}>Respondidas</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtradas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    backgroundColor: '#4a4a4a52',
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5170ff",
    marginBottom: 15,
  },
  filtros: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  filtro: {
    color: "#aaa",
    fontSize: 14,
    paddingVertical: 6,
  },
  filtroActivo: {
    color: "#fff",
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderColor: "#5170ff",
  },
  card: {
    backgroundColor: "#1b1b1b",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  titulo: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  detalle: {
    color: "#ccc",
    fontSize: 13,
  },
  estado: {
    marginTop: 8,
    padding: 5,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: "bold",
    width: "50%",
    textAlign: "center",
    color: "#000",
  },
  pendiente: {
    backgroundColor: "#ffbe0b",
  },
  proceso: {
    backgroundColor: "#4dabff",
  },
  respondida: {
    backgroundColor: "#06d6a0",
  },
  botones: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  btn: {
    backgroundColor: "#5170ff",
    padding: 10,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  btnReasignar: {
    backgroundColor: "#e63946",
    padding: 10,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
