import { Text, StyleSheet, View, TouchableOpacity, TextInput, Alert, Switch, ActivityIndicator, Keyboard, ScrollView } from 'react-native'
import React, { useState } from 'react';
import AuthController from '../controllers/AuthController';

export default function RegisterScreen({ navigation }) {
    const [nombre, setNombre] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [contraseniaConfirm, setContraseniaConfirm] = useState('');
    const [correo, setCorreo] = useState('');
    const [esEncendido, cambiarEncendido] = useState(false);
    const [correoError, setCorreoError] = useState(false);
    const [loading, setLoading] = useState(false);

    const mostrarAlertaRegistro = async () => {
        const validateCorreo = (correo) => {
            // Validar formato y dominios permitidos: @upq.edu.mx o @upq.mx
            const CorreoRegex = /^[^\s@]+@(upq\.edu\.mx|upq\.mx)$/i;
            if (CorreoRegex.test(correo)) {
                setCorreoError(false);
                return true;
            } else {
                setCorreoError(true);
                return false;
            }
        }
        
        // Validaciones básicas
        if (nombre.trim() === '' || contrasenia.trim() === '' || correo.trim() === '' || contraseniaConfirm.trim() === '') {
            Alert.alert("Error", "Favor de llenar todos los campos");
            return;
        } else if (!validateCorreo(correo)) {
            Alert.alert("Error", "Solo se permiten correos institucionales:\n• @upq.edu.mx (Estudiantes)\n• @upq.mx (Administradores)");
            return;
        } else if (esEncendido === false) {
            Alert.alert("Error", "Debes aceptar los términos y condiciones");
            return;
        } else if (contrasenia !== contraseniaConfirm) {
            Alert.alert("Error", "Las contraseñas no coinciden");
            return;
        } else if (contrasenia.length < 6) {
            Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
            return;
        }

        // Registrar en la BD
        setLoading(true);
        try {
            const resultado = await AuthController.registrar({
                nombre,
                email: correo,
                password: contrasenia,
                confirmPassword: contraseniaConfirm
            });

            if (resultado.success) {
                Alert.alert(
                    "¡Registro exitoso!", 
                    `Bienvenido ${nombre}! Ahora puedes iniciar sesión.`,
                    [{ 
                        text: "OK", 
                        onPress: () => {
                            // Limpiar formulario
                            setNombre('');
                            setCorreo('');
                            setContrasenia('');
                            setContraseniaConfirm('');
                            cambiarEncendido(false);
                            navigation.navigate('Login');
                        }
                    }]
                );
            } else {
                Alert.alert("Error", resultado.error || "No se pudo registrar el usuario");
            }
        } catch (error) {
            Alert.alert("Error", "Ocurrió un error al registrar");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView 
            contentContainerStyle={styles.background}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.titulo}>¡Bienvenido a Opina+!</Text>
            <View style={styles.loginContainer}>
                <TouchableOpacity>
                    <Text style={styles.etiquetas} onPress={() => navigation ? navigation.goBack() : null}>Volver</Text>
                </TouchableOpacity>
                <Text style={styles.titulo}>Registro</Text>
                
              

                <TextInput
                    style={styles.input}
                    placeholder='nombre'
                    value={nombre}
                    onChangeText={setNombre}
                />

                <TextInput
                    style={styles.input}
                    placeholder='correo@upq.edu.mx o correo@upq.mx'
                    value={correo}
                    onChangeText={setCorreo}
                    keyboardType='email-address'
                    autoCapitalize='none'
                />

                <TextInput
                    style={styles.input}
                    placeholder='contraseña'
                    value={contrasenia}
                    onChangeText={setContrasenia}
                    secureTextEntry={true}
                />

                <TextInput
                    style={styles.input}
                    placeholder='Ingresa la contraseña de nuevo'
                    value={contraseniaConfirm}
                    onChangeText={setContraseniaConfirm}
                    secureTextEntry={true}
                />

                <View style={styles.cajaTerminos}>
                    <Text style={styles.etiquetas}> Aceptar términos y condiciones </Text>
                    <Switch
                        value={esEncendido}
                        onValueChange={() => cambiarEncendido(!esEncendido)}
                        trackColor={{ true: '#5170ff', false: 'gray' }}
                    >

                    </Switch>
                </View>
                <TouchableOpacity 
                    style={[styles.btnContinuar, loading && styles.btnDisabled]} 
                    onPress={mostrarAlertaRegistro}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.btnText}>Continuar</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
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
    },
    volver: {
        fontSize: 14,
        color: '#4dabff',
        textDecorationLine: 'underline',
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
    textoContainer: {
        backgroundColor: 'black',
        padding: 20,
    },
    titulo: {
        fontSize: 32, // Tamaño de fuente grande para el título
        color: '#2701A9', // Color blanco para el título
        fontWeight: 'bold', // Negrita para el título
        marginBottom: 20, // Espacio debajo del título
    },
    infoText: {
        fontSize: 12,
        color: '#2701A9',
        backgroundColor: '#E8E3FF',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
        textAlign: 'left',
        lineHeight: 18,
    },
    etiquetas: {
        fontSize: 12, // Tamaño de fuente más grande para las etiquetas
        color: '#000000e0', // Color blanco para las etiquetas
        justifyContent: 'center',
        marginBottom: 10, // Espacio debajo de cada etiqueta

    },
    input: {

        width: '100%', // Ajusta el ancho según sea necesario
        color: '#000000',
        fontWeight: 'bold',
        borderWidth: 2, // Grosor del borde
        borderColor: '#ffffff81', // Color del borde
        borderRadius: 8, // Bordes redondeados
        padding: 10, // Espaciado interno
        marginBottom: 10, // Espaciado inferior
        backgroundColor: '#D9D9D9', // Color de fondo
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
    cajaTerminos: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        alignItems: 'center',
    },
    cajaOpciones: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginTop: 10,
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
    link: {
        color: "#2701A9",
        fontWeight: "bold",
        fontSize: 18,
    }

})
