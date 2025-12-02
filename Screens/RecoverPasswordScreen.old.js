import { Text, StyleSheet, View, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react';

export default function RecoverPasswordScreen({ navigation }) {
    const [correo, setCorreo] = useState('');
    const [correoError, setCorreoError] = useState(false);

    const enviarRecuperacion = () => {
        const validateCorreo = (correo) => {
            // Expresión regular básica para validar el formato del correo
            const CorreoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (CorreoRegex.test(correo)) {
                setCorreoError(false);
                return true;
            } else {
                setCorreoError(true);
                return false;
            }
        };

        if (correo.trim() === '') {
            setCorreoError(true);
            Alert.alert("Error", "Por favor ingresa tu correo electrónico");
            return;
        }
        
        if (!validateCorreo(correo)) {
            setCorreoError(true);
            Alert.alert("Error", "Por favor ingresa un correo válido");
            return;
        }

        // Aquí iría la lógica para enviar el correo de recuperación
        Alert.alert(
            "Correo Enviado",
            `Se ha enviado un correo de recuperación a:\n${correo}\n\nRevisa tu bandeja de entrada y sigue las instrucciones.`,
            [
                {
                    text: "OK",
                    onPress: () => navigation ? navigation.goBack() : null
                }
            ]
        );
    };

    return (
        <View style={styles.background}>
            <Text style={styles.titulo}>Opina +</Text>

            <View style={styles.loginContainer}>
                <TouchableOpacity onPress={() => navigation ? navigation.goBack() : null}>
                    <Text style={styles.etiquetas}>← Volver al inicio de sesión</Text>
                </TouchableOpacity>

                <Text style={styles.subtitulo}>
                    Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
                </Text>

                <Text style={styles.texto}>Correo Electrónico</Text>
                <TextInput
                    style={styles.input}
                    placeholder='correo@ejemplo.com'
                    value={correo}
                    onChangeText={setCorreo}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    autoCorrect={false}
                />

                {correoError && (
                    <Text style={styles.errorText}>Por favor ingresa un correo válido</Text>
                )}

                <View style={styles.cajaBotones}>
                    <TouchableOpacity style={styles.btnContinuar} onPress={enviarRecuperacion}>
                        <Text style={styles.btnText}>Enviar Correo de Recuperación</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.btn} 
                        onPress={() => navigation ? navigation.goBack() : null}
                    >
                        <Text style={styles.btnCancelText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
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
        color: '#ffffffc9',
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
