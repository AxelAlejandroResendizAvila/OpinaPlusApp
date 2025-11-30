import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity } from "react-native";

export default function ModScreen({ navigation }) {
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
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Opina +</Text>
      </View>
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2701A9",
    marginBottom: 15,
  },
  filtros: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  filtro: {
    color: "#666",
    fontSize: 14,
    paddingVertical: 6,
  },
  filtroActivo: {
    color: "#2701A9",
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderColor: "#2701A9",
  },
  card: {
    backgroundColor: "#D9D9D9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#ffffff81",
  },
  titulo: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  detalle: {
    color: "#000000",
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
    backgroundColor: "#2701A9",
    padding: 10,
    borderRadius: 30,
    width: "48%",
    alignItems: "center",
  },
  btnReasignar: {
    backgroundColor: "#e63946",
    padding: 10,
    borderRadius: 30,
    width: "48%",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
