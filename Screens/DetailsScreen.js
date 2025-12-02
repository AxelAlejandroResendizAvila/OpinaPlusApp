import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert, ScrollView } from "react-native";
import PeticionController from "../controllers/PeticionController";

export default function DetailsScreen({ navigation, route, rol = "alumno" }) {
  const { peticion } = route.params || {};

  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");

  if (!peticion) {
    return (
      <View style={styles.background}>
        <Text style={styles.error}>No se encontró la petición</Text>
      </View>
    );
  }

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

  const cambiarEstado = async (nuevoEstado) => {
    try {
      const resultado = await PeticionController.cambiarEstadoPeticion(peticion.id, nuevoEstado);
      if (resultado.success) {
        Alert.alert(
          "Éxito", 
          resultado.message,
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert("Error", resultado.error);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo cambiar el estado");
    }
  };

  const eliminarPeticion = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar esta petición?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const resultado = await PeticionController.eliminarPeticion(peticion.id);
              if (resultado.success) {
                Alert.alert("Éxito", resultado.message, [
                  { text: "OK", onPress: () => navigation.goBack() }
                ]);
              } else {
                Alert.alert("Error", resultado.error);
              }
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la petición");
            }
          }
        }
      ]
    );
  };

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-MX');
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
          <ScrollView style={styles.container}>
            <Text style={styles.titulo}>{peticion.titulo}</Text>

        <Text style={styles.sub}>Descripción:</Text>
        <Text style={styles.descripcion}>{peticion.descripcion}</Text>

        <Text style={styles.sub}>Categoría:</Text>
        <Text style={styles.descripcion}>{peticion.categoria}</Text>

        {peticion.adjunto && (
          <>
            <Text style={styles.sub}>Adjunto:</Text>
            <Text style={styles.descripcion}>{peticion.adjunto}</Text>
          </>
        )}

        <Text style={styles.sub}>Estado:</Text>
        <Text style={styles.estado}>
          {peticion.estado === 'abierta' ? 'Abierta' : 'Resuelta'}
        </Text>

        <Text style={styles.sub}>Fecha de creación:</Text>
        <Text style={styles.descripcion}>{formatearFecha(peticion.fecha_creacion)}</Text>

        <Text style={styles.sub}>Mensajes:</Text>

        {mensajes.length > 0 ? (
          <FlatList
              data={mensajes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <MensajeItem autor={item.autor} texto={item.texto} fecha={item.fecha} />
              )}
              style={{ marginBottom: 15 }}
              scrollEnabled={false}
          />
        ) : (
          <Text style={styles.descripcion}>No hay mensajes todavía</Text>
        )}

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

        {peticion.estado === 'abierta' && (
          <TouchableOpacity 
            style={styles.btnResolver} 
            onPress={() => cambiarEstado('resuelta')}
          >
            <Text style={styles.btnText}>Marcar como Resuelta</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.btnEliminar} onPress={eliminarPeticion}>
          <Text style={styles.btnText}>Eliminar Petición</Text>
        </TouchableOpacity>
          </ScrollView>
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
    btnResolver: {
        backgroundColor: "#06d6a0",
        padding: 14,
        borderRadius: 30,
        alignItems: "center",
        marginBottom: 10,
    },
    btnEliminar: {
        backgroundColor: "#e63946",
        padding: 14,
        borderRadius: 30,
        alignItems: "center",
        marginBottom: 20,
    },
    btnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    error: {
        color: "#e63946",
        fontSize: 18,
        textAlign: "center",
        marginTop: 50,
    },
    });
