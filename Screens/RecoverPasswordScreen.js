import { Text, StyleSheet, View, TouchableOpacity, TextInput, Alert, ActivityIndicator, Keyboard, ScrollView } from 'react-native'
import React, { useState } from 'react';
import AuthController from '../controllers/AuthController';

export default function RecoverPasswordScreen({ navigation }) {
    const [paso, setPaso] = useState(1); // 1: email, 2: código, 3: nueva contraseña
    const [correo, setCorreo] = useState('');
    const [codigo, setCodigo] = useState('');
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [codigoGenerado, setCodigoGenerado] = useState('');

    const solicitarCodigo = async () => {
        if (correo.trim() === '') {
            Alert.alert("Error", "Por favor ingresa tu correo electrónico");
            return;
        }

        const CorreoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!CorreoRegex.test(correo)) {
            Alert.alert("Error", "Por favor ingresa un correo válido");
            return;
        }

        setLoading(true);
        try {
            const resultado = await AuthController.solicitarRecuperacion(correo);
            
            if (resultado.success) {
                // En producción, el código se enviaría por email
                // Aquí lo mostramos para desarrollo
                if (resultado.data && resultado.data.codigo) {
                    setCodigoGenerado(resultado.data.codigo);
                    Alert.alert(
                        "Código Generado",
                        `Tu código de recuperación es: ${resultado.data.codigo}\n\n(En producción se enviaría por email)`,
                        [{ text: "OK", onPress: () => setPaso(2) }]
                    );
                } else {
                    Alert.alert(
                        "Solicitud Enviada",
                        "Si el correo existe, recibirás un código de recuperación",
                        [{ text: "OK", onPress: () => setPaso(2) }]
                    );
                }
            } else {
                Alert.alert("Error", resultado.error);
            }
        } catch (error) {
            Alert.alert("Error", "Ocurrió un error al solicitar la recuperación");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const verificarCodigo = async () => {
        if (codigo.trim() === '') {
            Alert.alert("Error", "Por favor ingresa el código");
            return;
        }

        if (codigo.length !== 6) {
            Alert.alert("Error", "El código debe tener 6 dígitos");
            return;
        }

        setLoading(true);
        try {
            const resultado = await AuthController.verificarCodigo(correo, codigo);
            
            if (resultado.success) {
                Alert.alert(
                    "Código Válido",
                    "Ahora puedes establecer tu nueva contraseña",
                    [{ text: "OK", onPress: () => setPaso(3) }]
                );
            } else {
                Alert.alert("Error", resultado.error);
            }
        } catch (error) {
            Alert.alert("Error", "Ocurrió un error al verificar el código");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const cambiarPassword = async () => {
        if (nuevaPassword.trim() === '' || confirmarPassword.trim() === '') {
            Alert.alert("Error", "Por favor completa todos los campos");
            return;
        }

        if (nuevaPassword.length < 6) {
            Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
            return;
        }

        if (nuevaPassword !== confirmarPassword) {
            Alert.alert("Error", "Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        try {
            const resultado = await AuthController.restablecerPassword(
                correo,
                codigo,
                nuevaPassword,
                confirmarPassword
            );
            
            if (resultado.success) {
                Alert.alert(
                    "¡Éxito!",
                    "Tu contraseña ha sido restablecida correctamente. Ahora puedes iniciar sesión.",
                    [{ 
                        text: "OK", 
                        onPress: () => navigation.navigate('Login')
                    }]
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

    const renderPaso1 = () => (
        <>
            <Text style={styles.subtitulo}>
                Ingresa tu correo electrónico y te enviaremos un código de verificación.
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

            <TouchableOpacity 
                style={[styles.btnContinuar, loading && styles.btnDisabled]} 
                onPress={solicitarCodigo}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.btnText}>Enviar Código</Text>
                )}
            </TouchableOpacity>
        </>
    );

    const renderPaso2 = () => (
        <>
            <Text style={styles.subtitulo}>
                Ingresa el código de 6 dígitos que recibiste.
            </Text>

            {codigoGenerado && (
                <View style={styles.codigoInfo}>
                    <Text style={styles.codigoText}>Código: {codigoGenerado}</Text>
                </View>
            )}

            <Text style={styles.texto}>Código de Verificación</Text>
            <TextInput
                style={styles.input}
                placeholder='123456'
                value={codigo}
                onChangeText={setCodigo}
                keyboardType='number-pad'
                maxLength={6}
            />

            <TouchableOpacity 
                style={[styles.btnContinuar, loading && styles.btnDisabled]} 
                onPress={verificarCodigo}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.btnText}>Verificar Código</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.btnSecundario} 
                onPress={() => setPaso(1)}
            >
                <Text style={styles.btnSecundarioText}>Reenviar Código</Text>
            </TouchableOpacity>
        </>
    );

    const renderPaso3 = () => (
        <>
            <Text style={styles.subtitulo}>
                Establece tu nueva contraseña.
            </Text>

            <Text style={styles.texto}>Nueva Contraseña</Text>
            <TextInput
                style={styles.input}
                placeholder='Mínimo 6 caracteres'
                value={nuevaPassword}
                onChangeText={setNuevaPassword}
                secureTextEntry={true}
            />

            <Text style={styles.texto}>Confirmar Contraseña</Text>
            <TextInput
                style={styles.input}
                placeholder='Repite tu contraseña'
                value={confirmarPassword}
                onChangeText={setConfirmarPassword}
                secureTextEntry={true}
            />

            <TouchableOpacity 
                style={[styles.btnContinuar, loading && styles.btnDisabled]} 
                onPress={cambiarPassword}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.btnText}>Cambiar Contraseña</Text>
                )}
            </TouchableOpacity>
        </>
    );

    return (
        <ScrollView 
            contentContainerStyle={styles.background}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.titulo}>Opina +</Text>

            <View style={styles.loginContainer}>
                <TouchableOpacity onPress={() => navigation ? navigation.navigate('Login') : null}>
                    <Text style={styles.etiquetas}>← Volver al inicio de sesión</Text>
                </TouchableOpacity>

                <Text style={styles.tituloPaso}>
                    {paso === 1 && "Recuperar Contraseña"}
                    {paso === 2 && "Verificar Código"}
                    {paso === 3 && "Nueva Contraseña"}
                </Text>

                {paso === 1 && renderPaso1()}
                {paso === 2 && renderPaso2()}
                {paso === 3 && renderPaso3()}

                <TouchableOpacity 
                    style={styles.btn} 
                    onPress={() => navigation ? navigation.navigate('Login') : null}
                >
                    <Text style={styles.btnCancelText}>Cancelar</Text>
                </TouchableOpacity>
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
        backgroundColor: '#ffffff',
    },
    texto: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
    },
    subtitulo: {
        fontSize: 16,
        color: '#666',
        marginTop: 15,
        marginBottom: 10,
        textAlign: 'center',
        lineHeight: 22,
    },
    titulo: {
        fontSize: 36,
        color: '#2701A9',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    tituloPaso: {
        fontSize: 24,
        color: '#2701A9',
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
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
        color: '#000',
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
    btnSecundario: {
        padding: 12,
        alignItems: "center",
        marginTop: 10,
    },
    btnSecundarioText: {
        color: "#2701A9",
        fontSize: 16,
        fontWeight: "bold",
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
    codigoInfo: {
        backgroundColor: '#FFF3CD',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#FFC107',
    },
    codigoText: {
        color: '#856404',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
