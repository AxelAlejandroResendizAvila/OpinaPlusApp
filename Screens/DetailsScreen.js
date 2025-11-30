import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, TextInput, FlatList, Alert } from "react-native";

export default function DetailsScreen({ navigation, rol = "alumno" }) {

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
        <View style={styles.background}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Opina +</Text>
          </View>
          <View style={styles.container}>
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
          </View>
        </View>
  );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
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
        flex: 1,
        backgroundColor: "#ffffff",
        padding: 20,
    },
    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2701A9",
        marginBottom: 10,
    },
    sub: {
        color: "#000000",
        fontSize: 14,
        marginTop: 10,
        marginBottom: 3,
        fontWeight: "bold",
    },
    descripcion: {
        color: "#000000",
        fontSize: 14,
        marginBottom: 10,
    },
    estado: {
        color: "#2701A9",
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
        backgroundColor: "#D9D9D9",
        borderLeftWidth: 4,
        borderLeftColor: "#2701A9",
    },
     msgModerador: {
        backgroundColor: "#D9D9D9",
        borderLeftWidth: 4,
        borderLeftColor: "#06d6a0",
    },
    msgAutor: {
        color: "#000000",
        fontWeight: "bold",
    },
    msgTexto: {
        color: "#000000",
    },
    msgFecha: {
        color: "#666",
        fontSize: 11,
        marginTop: 3,
    },
    input: {
        borderWidth: 2,
        borderColor: "#ffffff81",
        backgroundColor: "#D9D9D9",
        padding: 10,
        borderRadius: 8,
        color: "#000000",
        marginBottom: 10,
    },
    btnEnviar: {
        backgroundColor: "#2701A9",
        padding: 14,
        borderRadius: 30,
        alignItems: "center",
        marginBottom: 10,
    },
    btnCerrar: {
        backgroundColor: "#e63946",
        padding: 14,
        borderRadius: 30,
        alignItems: "center",
    },
    btnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    });
