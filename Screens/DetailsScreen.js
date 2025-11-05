import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, TextInput, FlatList, Alert } from "react-native";

export default function DetailsScreen({ rol = "alumno" }) {

  const [mensajes, setMensajes] = useState([
    { id: "1", autor: "Alumno", texto: "Mi salón no tiene aire acondicionado.", fecha: "01/11/2024" },
    { id: "2", autor: "Moderador", texto: "Se revisará con mantenimiento.", fecha: "02/11/2024" },
  ]);

  const [nuevoMensaje, setNuevoMensaje] = useState("");

  const estado = "En proceso";
  const titulo = "Aula sin aire acondicionado";
  const descripcion = "En el salón B302 el aire acondicionado no funciona desde hace dos semanas. Hace demasiado calor para trabajar bien.";

  const enviarMensaje = () => {
    if (nuevoMensaje.trim() === "") {
      Alert.alert("Mensaje vacío", "Escribe algo para enviar");
      return;
    }

    const nuevo = {
      id: Date.now().toString(),
      autor: rol === "alumno" ? "Alumno" : "Moderador",
      texto: nuevoMensaje,
      fecha: new Date().toLocaleDateString(),
    };

    setMensajes([...mensajes, nuevo]);
    setNuevoMensaje("");
  };

  const cerrarPeticion = () => {
    Alert.alert("Petición cerrada", "Has cerrado la solicitud exitosamente.");
  };

  const MensajeItem = ({ autor, texto, fecha }) => (
    <View style={[styles.msg, autor === "Alumno" ? styles.msgAlumno : styles.msgModerador]}>
      <Text style={styles.msgAutor}>{autor}</Text>
      <Text style={styles.msgTexto}>{texto}</Text>
      <Text style={styles.msgFecha}>{fecha}</Text>
    </View>
  );

  return (

        <ImageBackground
            source={require("../assets/BG2.png")}
            style={styles.container}>
        <Text style={styles.titulo}>{titulo}</Text>

        <Text style={styles.sub}>Descripción:</Text>
        <Text style={styles.descripcion}>{descripcion}</Text>

        <Text style={styles.sub}>Estado:</Text>
        <Text style={styles.estado}>{estado}</Text>

        <Text style={styles.sub}>Mensajes:</Text>

        <FlatList
            data={mensajes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <MensajeItem autor={item.autor} texto={item.texto} fecha={item.fecha} />
            )}
            style={{ marginBottom: 15 }}
        />

        <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#777"
            value={nuevoMensaje}
            onChangeText={setNuevoMensaje}
        />

        <TouchableOpacity style={styles.btnEnviar} onPress={enviarMensaje}>
            <Text style={styles.btnText}>Responder</Text>
        </TouchableOpacity>

        {rol === "alumno" && (
            <TouchableOpacity style={styles.btnCerrar} onPress={cerrarPeticion}>
            <Text style={styles.btnText}>Cerrar Petición</Text>
            </TouchableOpacity>
        )}
        </ImageBackground>
  
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000ff",
        padding: 20,
        paddingTop: 60,
    },
    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#5170ff",
        marginBottom: 10,
    },
    sub: {
        color: "#fff",
        fontSize: 14,
        marginTop: 10,
        marginBottom: 3,
        fontWeight: "bold",
    },
    descripcion: {
        color: "#ccc",
        fontSize: 14,
        marginBottom: 10,
    },
    estado: {
        color: "#ffbe0b",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    msg: {
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    msgAlumno: {
        backgroundColor: "#1f1f1f",
        borderLeftWidth: 4,
        borderLeftColor: "#5170ff",
    },
     msgModerador: {
        backgroundColor: "#1f1f1f",
        borderLeftWidth: 4,
        borderLeftColor: "#06d6a0",
    },
    msgAutor: {
        color: "#fff",
        fontWeight: "bold",
    },
    msgTexto: {
        color: "#ccc",
    },
    msgFecha: {
        color: "#777",
        fontSize: 11,
        marginTop: 3,
    },
    input: {
        borderWidth: 1,
        borderColor: "#444",
        backgroundColor: "#111",
        padding: 10,
        borderRadius: 8,
        color: "#fff",
        marginBottom: 10,
    },
    btnEnviar: {
        backgroundColor: "#5170ff",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    btnCerrar: {
        backgroundColor: "#e63946",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    btnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    });
