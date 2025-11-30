import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, FlatList } from "react-native";

export default function RequestScreen({ navigation }) {
  const [filtro, setFiltro] = useState("Todas");

  const peticiones = [
    { id: "1", titulo: "Problema con calificaciones", estado: "Abierta", fecha: "01/11/2024" },
    { id: "2", titulo: "Aula sin aire acondicionado", estado: "En proceso", fecha: "29/10/2024" },
    { id: "3", titulo: "Equipo de cómputo dañado", estado: "Resuelta", fecha: "20/09/2024" },
  ];

  const filtradas =
    filtro === "Todas" ? peticiones : peticiones.filter(p => p.estado === filtro);

  const Item = ({ titulo, estado, fecha }) => (
    <View style={styles.card}>
      <Text style={styles.titulo}>{titulo}</Text>
      <View style={styles.row}>
        <Text style={styles.fecha}>{fecha}</Text>
        <Text style={[styles.estado, estadoStyle(estado)]}>{estado}</Text>
      </View>
    </View>
  );

  const estadoStyle = (estado) => {
    switch (estado) {
      case "Abierta":
        return { color: "#e63946" };
      case "En proceso":
        return { color: "#ffbe0b" };
      case "Resuelta":
        return { color: "#06d6a0" };
      default:
        return { color: "#fff" };
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Opina +</Text>
      </View>
    <View style={styles.container}>
      <Text style={styles.title}>Mis Solicitudes</Text>

      <View style={styles.filtros}>
        {["Todas", "Abierta", "En proceso", "Resuelta"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.filterBtn, filtro === item && styles.filterActive]}
            onPress={() => setFiltro(item)}
          >
            <Text style={styles.filterText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Item titulo={item.titulo} estado={item.estado} fecha={item.fecha} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay solicitudes en esta categoría</Text>
        }
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
        fontSize: 26,
        fontWeight: "bold",
        color: "#2701A9",
        marginBottom: 10,
    },
    filtros: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
        flexWrap: "wrap",
    },
    filterBtn: {
        paddingVertical: 8,
        paddingHorizontal: 8,
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
    card: {
        backgroundColor: "#D9D9D9",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: "#ffffff81",
    },
    titulo: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "bold",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
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
    empty: {
        color: "#666",
        textAlign: "center",
        marginTop: 30,
    },
});
