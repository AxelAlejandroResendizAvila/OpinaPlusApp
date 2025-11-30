import { Text, StyleSheet, View, TouchableOpacity, TextInput, Alert, Switch } from 'react-native'
import React, { useEffect, useState } from 'react';

export default function RegisterScreen({ navigation }) {
    const [nombre, setNombre] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [contraseniaConfirm, setContraseniaConfirm] = useState('');
    const [correo, setCorreo] = useState('');
    const [esEncendido, cambiarEncendido] = useState(false);
    const [correoError, setCorreoError] = useState(false);

    const mostrarAlertaRegistro = () => {
        const validateCorreo = (correo) => {
            // Expresión regular básica para validar el formato del correo
            const CorreoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (CorreoRegex.test(correo)) {
                setCorreoError(false);
            } else {
                setCorreoError(true);
            }
        }
        validateCorreo(correo);
        if (nombre.trim() === '' && contrasenia.trim() === '' && correo.trim() === '' && contraseniaConfirm.trim() === '') {
            Alert.alert("Error, favor de llenar todos los campos (Móvil)");
            alert("Favor de llenar todos los campos (Web)");
        } else if (nombre.trim() === '') {
            Alert.alert("Error, favor de llenar el campo del nombre(Móvil)");
            alert("Favor de llenar el campo del nombre (Web)");
        } else if (contrasenia.trim() === '') {
            Alert.alert("Error, favor de llenar el campo de la contraseña(Móvil)");
            alert("Favor de llenar el campo de la contraseña (Web)");
        } else if (contraseniaConfirm.trim() === '') {
            Alert.alert("Error, favor de llenar el campo de confirmación de la contraseña(Móvil)");
            alert("Favor de llenar el campo de confirmación de la contraseña (Web)");
        } else if (correo.trim() === '') {
            Alert.alert("Error, favor de llenar el campo del correo(Móvil)");
            alert("Favor de llenar el campo del correo (Web)");
        } else if (esEncendido === false) {
            Alert.alert("Error, favor de aceptar los términos y condiciones(Móvil)");
            alert("Favor de aceptar los términos y condiciones(Web)");
        } else if (contrasenia !== contraseniaConfirm) {
            Alert.alert("Error, las contraseñas no coinciden(Móvil)");
            alert("Las contraseñas no coinciden(Web)");
        } else if (correoError) {
            Alert.alert("Error, ingresa un correo valido(Móvil)");
            alert("Favor de ingresar un correo valido(Web)");
        } else {
            // Navegar a Login después del registro exitoso
            if (navigation) {
                Alert.alert(
                    "Registro exitoso", 
                    `Bienvenido ${nombre}! Ahora puedes iniciar sesión.`,
                    [{ text: "OK", onPress: () => navigation.navigate('Login') }]
                );
            } else {
                //Alert para móvil
                Alert.alert(`Registro exitoso`, `Nombre: ${nombre}\ncorreo: ${correo}`);
                //Alert para web
                alert(`Registro exitoso\nNombre: ${nombre}\ncorreo: ${correo}\n`);
            }
        }
    }

    return (
        <View style={styles.background}>
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
                    placeholder='correo@ejemplo.com'
                    value={correo}
                    onChangeText={setCorreo}
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
                <TouchableOpacity style={styles.btnContinuar} onPress={mostrarAlertaRegistro}>
                    <Text style={styles.btnText}>Continuar</Text>
                </TouchableOpacity>
            </View>
        </View>
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
    etiquetas: {
        fontSize: 12, // Tamaño de fuente más grande para las etiquetas
        color: '#000000e0', // Color blanco para las etiquetas
        justifyContent: 'center',
        marginBottom: 10, // Espacio debajo de cada etiqueta

    },
    input: {

        width: '100%', // Ajusta el ancho según sea necesario
        color: '#ffffffc9',
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
