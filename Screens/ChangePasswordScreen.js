import { Text, StyleSheet, View, TouchableOpacity, TextInput, Alert, ActivityIndicator, Keyboard, ScrollView } from 'react-native'
import React, { useState } from 'react';
import AuthController from '../controllers/AuthController';
import { useAuth } from '../context/AuthContext';

export default function ChangePasswordScreen({ navigation }) {
    const [contrasenaActual, setContrasenaActual] = useState('');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [repetirContrasena, setRepetirContrasena] = useState('');
    const [errorActual, setErrorActual] = useState(false);
    const [errorNueva, setErrorNueva] = useState(false);
    const [errorRepetir, setErrorRepetir] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const cambiarContrasena = async () => {
        // Reset errors
        setErrorActual(false);
        setErrorNueva(false);
        setErrorRepetir(false);

        // Validaciones
        if (contrasenaActual.trim() === '') {
            setErrorActual(true);
            Alert.alert("Error", "Por favor ingresa tu contraseña actual");
            return;
        }

        if (nuevaContrasena.trim() === '') {
            setErrorNueva(true);
            Alert.alert("Error", "Por favor ingresa tu nueva contraseña");
            return;
        }

        if (nuevaContrasena.length < 6) {
            setErrorNueva(true);
            Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
            return;
        }

        if (repetirContrasena.trim() === '') {
            setErrorRepetir(true);
            Alert.alert("Error", "Por favor confirma tu nueva contraseña");
            return;
        }

        if (nuevaContrasena !== repetirContrasena) {
            setErrorRepetir(true);
            Alert.alert("Error", "Las contraseñas no coinciden");
            return;
        }

        if (contrasenaActual === nuevaContrasena) {
            setErrorNueva(true);
            Alert.alert("Error", "La nueva contraseña debe ser diferente a la actual");
            return;
        }

        // Cambiar contraseña en la BD
        setLoading(true);
        try {
            const resultado = await AuthController.cambiarPassword(
                user.id,
                contrasenaActual,
                nuevaContrasena,
                repetirContrasena
            );

            if (resultado.success) {
                Alert.alert(
                    "¡Éxito!",
                    "Tu contraseña ha sido actualizada correctamente",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                setContrasenaActual('');
                                setNuevaContrasena('');
                                setRepetirContrasena('');
                                navigation ? navigation.goBack() : null;
                            }
                        }
                    ]
                );
            } else {
                Alert.alert("Error", resultado.error);
            }
        } catch (error) {
            Alert.alert("Error", "Ocurrió un error al cambiar la contraseña");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView 
            contentContainerStyle={styles.background}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.titulo}>Cambiar Contraseña</Text>

            <View style={styles.loginContainer}>
                <TouchableOpacity onPress={() => navigation ? navigation.goBack() : null}>
                    <Text style={styles.etiquetas}>← Volver</Text>
                </TouchableOpacity>

                <Text style={styles.subtitulo}>
                    Ingresa tu contraseña actual y la nueva contraseña que deseas utilizar.
                </Text>

                <Text style={styles.texto}>Contraseña Actual</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Contraseña actual'
                    value={contrasenaActual}
                    onChangeText={setContrasenaActual}
                    secureTextEntry={true}
                    autoCapitalize='none'
                    autoCorrect={false}
                />
                {errorActual && (
                    <Text style={styles.errorText}>Por favor ingresa tu contraseña actual</Text>
                )}

                <Text style={styles.texto}>Nueva Contraseña</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Nueva contraseña (mínimo 6 caracteres)'
                    value={nuevaContrasena}
                    onChangeText={setNuevaContrasena}
                    secureTextEntry={true}
                    autoCapitalize='none'
                    autoCorrect={false}
                />
                {errorNueva && (
                    <Text style={styles.errorText}>Por favor ingresa una contraseña válida</Text>
                )}

                <Text style={styles.texto}>Repetir Nueva Contraseña</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Confirma tu nueva contraseña'
                    value={repetirContrasena}
                    onChangeText={setRepetirContrasena}
                    secureTextEntry={true}
                    autoCapitalize='none'
                    autoCorrect={false}
                />
                {errorRepetir && (
                    <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
                )}

                <View style={styles.cajaBotones}>
                    <TouchableOpacity 
                        style={[styles.btnContinuar, loading && styles.btnDisabled]} 
                        onPress={cambiarContrasena}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.btnText}>Continuar</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.btn} 
                        onPress={() => navigation ? navigation.goBack() : null}
                    >
                        <Text style={styles.btnCancelText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    texto: {
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
    },
    subtitulo: {
        fontSize: 16,
        color: '#666',
        marginTop: 15,
        marginBottom: 10,
        textAlign: 'center',
        lineHeight: 22,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
        marginBottom: 10,
    },
    splashContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 50,
    },
    splashImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    splashText: {
        position: 'absolute',
        marginBottom: 60,
        fontSize: 20,
        color: '5170ff',
        marginTop: 400,
    },
    titulo: {
        fontSize: 36,
        color: '#2701A9',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    etiquetas: {
        fontSize: 14,
        color: '#2701A9',
        justifyContent: 'center',
        marginBottom: 10,
        fontWeight: '600',
    },
    input: {
        width: '100%',
        color: '#000000',
        fontWeight: 'bold',
        borderWidth: 2,
        borderColor: '#ffffff81',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#D9D9D9',
    },
    loginContainer: {
        backgroundColor: '#ffffffff',
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
    cajaBotones: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    btn: {
        padding: 12,
        alignItems: "center",
    },
    btnContinuar: {
        backgroundColor: "#2701A9",
        padding: 14,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 15
    },
    btnDisabled: {
        backgroundColor: "#6B6B6B",
    },
    btnText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold"
    },
    btnCancelText: {
        color: "#ff0000ff",
        fontSize: 18,
        fontWeight: "bold"
    },
});
