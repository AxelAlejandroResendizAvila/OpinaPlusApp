import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput, ActivityIndicator, Modal } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import AuthController from '../controllers/AuthController';

export default function ProfileAdminScreen({ navigation }) {
  const { user, logout, updateUser } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [nombreEdit, setNombreEdit] = useState(user?.nombre || '');
  const [loading, setLoading] = useState(false);

  const cambiarContrasenia = () => {
    if (navigation) {
      navigation.navigate('ChangePassword');
    }
  };

  const abrirModalEditar = () => {
    setNombreEdit(user?.nombre || '');
    setModalVisible(true);
  };

  const guardarCambios = async () => {
    if (nombreEdit.trim() === '') {
      Alert.alert("Error", "El nombre no puede estar vacío");
      return;
    }

    setLoading(true);
    try {
      const resultado = await AuthController.actualizarUsuario(user.id, {
        nombre: nombreEdit.trim(),
        email: user.email
      });

      if (resultado.success) {
        await updateUser({ ...user, nombre: nombreEdit.trim() });
        setModalVisible(false);
        Alert.alert("¡Éxito!", "Tu información ha sido actualizada");
      } else {
        Alert.alert("Error", resultado.error || "No se pudo actualizar la información");
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al actualizar la información");
      console.error(error);
    } finally {
      setLoading(false);
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
          onPress: async () => {
            await logout();
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
        <View style={styles.adminBadge}>
          <Ionicons name="shield-checkmark" size={16} color="#fff" />
          <Text style={styles.adminBadgeText}>ADMIN</Text>
        </View>
      </View>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.title}>Perfil de Administrador</Text>

          {/* Foto de perfil */}
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageWrapper}>
              <Ionicons name="shield" size={100} color="#2701A9" />
            </View>
          </View>

          {/* Información del usuario */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Información Personal</Text>

            <View style={styles.infoItem}>
              <Ionicons name="person" size={20} color="#2701A9" style={styles.icon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Nombre</Text>
                <Text style={styles.infoValue}>{user?.nombre || 'No disponible'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="mail" size={20} color="#2701A9" style={styles.icon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Correo Institucional</Text>
                <Text style={styles.infoValue}>{user?.email || 'No disponible'}</Text>
              </View>
            </View>

            <View style={[styles.infoItem, styles.infoItemAdmin]}>
              <Ionicons name="shield-checkmark" size={20} color="#fff" style={styles.icon} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: '#fff' }]}>Rol</Text>
                <Text style={[styles.infoValue, { color: '#fff' }]}>Administrador</Text>
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

          {/* Permisos de administrador */}
          <View style={styles.permissionsSection}>
            <Text style={styles.sectionTitle}>Permisos de Administrador</Text>
            <View style={styles.permissionCard}>
              <Ionicons name="checkmark-circle" size={20} color="#28a745" />
              <Text style={styles.permissionText}>Gestionar peticiones</Text>
            </View>
            <View style={styles.permissionCard}>
              <Ionicons name="checkmark-circle" size={20} color="#28a745" />
              <Text style={styles.permissionText}>Ver estadísticas</Text>
            </View>
            <View style={styles.permissionCard}>
              <Ionicons name="checkmark-circle" size={20} color="#28a745" />
              <Text style={styles.permissionText}>Moderar contenido</Text>
            </View>
            <View style={styles.permissionCard}>
              <Ionicons name="checkmark-circle" size={20} color="#28a745" />
              <Text style={styles.permissionText}>Acceso completo al sistema</Text>
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.btnAccion} onPress={abrirModalEditar}>
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

      {/* Modal para editar información */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Información</Text>

            <Text style={styles.modalLabel}>Nombre</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ingresa tu nombre"
              value={nombreEdit}
              onChangeText={setNombreEdit}
              editable={!loading}
            />

            <Text style={styles.modalLabel}>Correo Institucional</Text>
            <TextInput
              style={[styles.modalInput, styles.inputDisabled]}
              value={user?.email}
              editable={false}
            />
            <Text style={styles.modalNote}>
              * El correo institucional no se puede modificar
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]} 
                onPress={() => setModalVisible(false)}
                disabled={loading}
              >
                <Text style={styles.modalBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnSave, loading && styles.btnDisabled]} 
                onPress={guardarCambios}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalBtnText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2701A9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginTop: 8,
    gap: 4,
  },
  adminBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
  },
  profileImageWrapper: {
    backgroundColor: '#E8E3FF',
    borderRadius: 70,
    padding: 20,
    borderWidth: 3,
    borderColor: '#2701A9',
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
  infoItemAdmin: {
    backgroundColor: '#2701A9',
    borderColor: '#2701A9',
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
  permissionsSection: {
    marginBottom: 30,
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 10,
  },
  permissionText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2701A9',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 14,
    color: '#2701A9',
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
  },
  modalInput: {
    backgroundColor: '#D9D9D9',
    borderWidth: 2,
    borderColor: '#ffffff81',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  inputDisabled: {
    backgroundColor: '#E8E8E8',
    color: '#666',
  },
  modalNote: {
    fontSize: 11,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  modalBtnCancel: {
    backgroundColor: '#6c757d',
  },
  modalBtnSave: {
    backgroundColor: '#2701A9',
  },
  modalBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnDisabled: {
    backgroundColor: '#6B6B6B',
    opacity: 0.6,
  },
});
