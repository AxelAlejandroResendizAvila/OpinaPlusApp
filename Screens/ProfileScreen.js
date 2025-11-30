import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const [nombre, setNombre] = useState("Daniel García");
  const [correo, setCorreo] = useState("daniel.garcia@ejemplo.com");
  const [telefono, setTelefono] = useState("+52 123 456 7890");

  const cambiarFoto = () => {
    Alert.alert("Cambiar Foto", "Funcionalidad para cambiar foto de perfil");
  };

  const editarInformacion = () => {
    Alert.alert("Editar Información", "Aquí podrás editar tu información personal");
  };

  const cambiarContrasenia = () => {
    if (navigation) {
      navigation.navigate('ChangePassword');
    } else {
      Alert.alert("Cambiar Contraseña", "Redirigiendo a cambio de contraseña");
    }
  };

  const cerrarSesion = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Cerrar Sesión", 
          onPress: () => {
            if (navigation) {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Opina +</Text>
      </View>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.title}>Mi Perfil</Text>

          {/* Foto de perfil */}
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageWrapper}>
              <Ionicons name="person-circle" size={120} color="#2701A9" />
            </View>
            <TouchableOpacity style={styles.btnCambiarFoto} onPress={cambiarFoto}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Información del usuario */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Información Personal</Text>

            <View style={styles.infoItem}>
              <Ionicons name="person" size={20} color="#2701A9" style={styles.icon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Nombre</Text>
                <Text style={styles.infoValue}>{nombre}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="mail" size={20} color="#2701A9" style={styles.icon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Correo Electrónico</Text>
                <Text style={styles.infoValue}>{correo}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="call" size={20} color="#2701A9" style={styles.icon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue}>{telefono}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="lock-closed" size={20} color="#2701A9" style={styles.icon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Contraseña</Text>
                <Text style={styles.infoValue}>••••••••</Text>
              </View>
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.btnAccion} onPress={editarInformacion}>
              <Ionicons name="create-outline" size={20} color="#fff" style={styles.btnIcon} />
              <Text style={styles.btnText}>Editar Información</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnAccion} onPress={cambiarContrasenia}>
              <Ionicons name="key-outline" size={20} color="#fff" style={styles.btnIcon} />
              <Text style={styles.btnText}>Cambiar Contraseña</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btnAccion, styles.btnCerrarSesion]} onPress={cerrarSesion}>
              <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.btnIcon} />
              <Text style={styles.btnText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    width: '100%',
    height: '100%',
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
  scrollContainer: {
    width: '100%',
  },
  container: {
    backgroundColor: '#ffffff',
    width: '90%',
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2701A9",
    marginBottom: 20,
    textAlign: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  profileImageWrapper: {
    backgroundColor: '#D9D9D9',
    borderRadius: 70,
    padding: 10,
    borderWidth: 3,
    borderColor: '#2701A9',
  },
  btnCambiarFoto: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#2701A9',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  infoSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2701A9',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ffffff81',
  },
  icon: {
    marginRight: 15,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  actionsSection: {
    gap: 10,
  },
  btnAccion: {
    backgroundColor: '#2701A9',
    padding: 14,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    marginRight: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnCerrarSesion: {
    backgroundColor: '#e63946',
    marginTop: 10,
  },
});
