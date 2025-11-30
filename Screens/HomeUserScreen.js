import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { Ionicons } from '@expo/vector-icons';

export default function HomeUserScreen({ navigation }) {

  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
        <View
          style={styles.container}
        >
          <View style={styles.headerContainer}>
                  <Text style={styles.headerText}>Opina +</Text>
                </View>
          <Text style={styles.titulo}>Bienvenido, Daniel</Text>

          <Animated.View style={[styles.cardsContainer, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Request')}>
              <Ionicons name="folder-open" size={40} color="#5170ff" />
              <Text style={styles.subtitulo}>Peticiones Abiertas</Text>
              <Text style={styles.numero}>4</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Request')}>
              <Ionicons name="checkmark-circle" size={40} color="#2cbb77" />
              <Text style={styles.subtitulo}>Peticiones Resueltas</Text>
              <Text style={styles.numero}>12</Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={styles.btnPrincipal}
            onPress={() => navigation.navigate("Create")}
          >
            <Text style={styles.btnText}>+ Crear Petición</Text>
          </TouchableOpacity>
        </View>
      );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '80%',
    paddingBottom: 20,
   
  },
  headerText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2701A9",
    
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 25,
    paddingTop: 60,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2701A9",
    marginBottom: 25,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#D9D9D9",
    width: "48%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff81",
  },
  subtitulo: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 6,
    fontWeight: "bold",
  },
  numero: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2701A9",
  },
  btnPrincipal: {
    backgroundColor: "#2701A9",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
