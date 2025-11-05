import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, Alert } from "react-native";

export default function CreateScreen() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [adjunto, setAdjunto] = useState("");

  const enviarPeticion = () => {
    if (!titulo.trim() || !descripcion.trim() || !categoria.trim()) {
      Alert.alert("Error", "Todos los campos obligatorios deben llenarse.");
      return;
    }

    Alert.alert(
      "Solicitud enviada ✅",
      `Título: ${titulo}\nDescripción: ${descripcion}\nCategoría: ${categoria}\nAdjunto: ${adjunto || "Sin adjunto"}`
    );

    setTitulo("");
    setDescripcion("");
    setCategoria("");
    setAdjunto("");
  };

  return (
    <ImageBackground
       source={require("../assets/BG2.png")}
       resizeMode='cover'
       style={styles.background}
    >
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Solicitud / Queja</Text>

      <Text style={styles.label}>Título *</Text>
      <TextInput
        style={styles.input}
        placeholder="Título de la solicitud"
        placeholderTextColor="#999"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.label}>Descripción *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe tu situación..."
        placeholderTextColor="#999"
        multiline
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <Text style={styles.label}>Categoría *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Profesor, Instalaciones, Servicios..."
        placeholderTextColor="#999"
        value={categoria}
        onChangeText={setCategoria}
      />

      <Text style={styles.label}>Adjunto (opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe el nombre del archivo o enlace"
        placeholderTextColor="#999"
        value={adjunto}
        onChangeText={setAdjunto}
      />

      <TouchableOpacity style={styles.btn} onPress={enviarPeticion}>
        <Text style={styles.btnText}>Enviar Petición</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4a4a4a52',
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
    background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#5170ff",
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    padding: 10,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  btn: {
    backgroundColor: "#5170ff",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
