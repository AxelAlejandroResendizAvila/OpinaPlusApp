import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Keyboard, ScrollView } from "react-native";
import PeticionController from "../controllers/PeticionController";

export default function CreateScreen({ navigation }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [adjunto, setAdjunto] = useState("");
  const [loading, setLoading] = useState(false);

  const enviarPeticion = async () => {
    if (!titulo.trim() || !descripcion.trim() || !categoria.trim()) {
      Alert.alert("Error", "Todos los campos obligatorios deben llenarse.");
      return;
    }

    setLoading(true);

    try {
      const resultado = await PeticionController.crearPeticion({
        titulo,
        descripcion,
        categoria,
        adjunto
      });

      if (resultado.success) {
        Alert.alert(
          "¡Éxito!",
          `Petición creada correctamente.\nTítulo: ${titulo}\nCategoría: ${categoria}`,
          [{ 
            text: "OK", 
            onPress: () => {
              setTitulo("");
              setDescripcion("");
              setCategoria("");
              setAdjunto("");
              if (navigation) {
                navigation.goBack();
              }
            }
          }]
        );
      } else {
        Alert.alert("Error", resultado.error || "No se pudo crear la petición");
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al guardar la petición");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Opina +</Text>
      </View>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.container}>
        <Text style={styles.title}>Crear Petición</Text>

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

        <TouchableOpacity 
          style={[styles.btn, loading && styles.btnDisabled]} 
          onPress={enviarPeticion}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Enviar</Text>
          )}
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  headerContainer: {
    width: '80%',
    padding: 20,
   
  },
  headerText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2701A9",
    marginBottom: 20,
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
    alignItems: 'center',
    justifyContent: 'center', 
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2701A9",
    marginBottom: 20,
  },
  label: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#D9D9D9",
    borderWidth: 2,
    borderColor: "#ffffff81",
    borderRadius: 8,
    padding: 10,
    color: "#000000",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  btn: {
    backgroundColor: "#2701A9",
    padding: 14,
    borderRadius: 30,
    marginTop: 25,
  },
  btnDisabled: {
    backgroundColor: "#6B6B6B",
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});
