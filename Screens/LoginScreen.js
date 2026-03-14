import { Text, StyleSheet, View, ImageBackground, Animated, Easing, TouchableOpacity, TextInput, Alert, ActivityIndicator, Keyboard, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react';
import { CommonActions } from '@react-navigation/native';
import AuthController from '../controllers/AuthController';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
    const [cargando, setCargando] = useState(true);
    const desvanecido = new Animated.Value(1);
    const [contrasenia, setContrasenia] = useState('');
    const [correoLogin, setCorreoLogin] = useState('');
    const [correoError, setCorreoError] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

   const Recuperarla = () => {
    if (navigation) {
        navigation.navigate('RecoverPassword');
    } else {
        Alert.alert("Recuperar Contraseña","Se ha enviado un correo para recuperar tu contraseña");
    }
   }

    const mostrarAlertaLogin = async () => {
        const validateCorreo = (correoLogin) => {
        // Validar formato y dominios permitidos: @upq.edu.mx o @upq.mx
        const CorreoRegex = /^[^\s@]+@(upq\.edu\.mx|upq\.mx)$/i;
        if (CorreoRegex.test(correoLogin)) {
          setCorreoError(false);
          return true;
        } else {
          setCorreoError(true);
          return false;
        }
      };
      
      // Validaciones básicas
      if(contrasenia.trim() === '' && correoLogin.trim() === ''){    
        Alert.alert("Error", "Favor de llenar todos los campos");
        return;
      }else if(contrasenia.trim() === '') {
        Alert.alert("Error", "Favor de llenar el campo de la contraseña");
        return;
      }else if( correoLogin.trim() === ''){
        Alert.alert("Error", "Favor de llenar el campo del correo");
        return;
      }else if(!validateCorreo(correoLogin)){
        Alert.alert("Error", "Solo se permiten correos institucionales de la UPQ");
        return;
      }

      // Intentar login con la BD
      setLoading(true);
      try {
        const resultado = await AuthController.login(correoLogin, contrasenia);
        console.log('[LoginScreen] Resultado del login:', resultado);
        
        if (resultado.success) {
          console.log('[LoginScreen] Login exitoso');
          console.log('[LoginScreen] Datos del usuario:', resultado.data);
          console.log('[LoginScreen] Rol:', resultado.data.rol);
          
          // Guardar sesión
          await login(resultado.data);
          console.log('[LoginScreen] Sesión guardada');
          
          const destino = resultado.data.rol === 'admin' ? 'HomeAdmin' : 'HomeUser';
          console.log('[LoginScreen] Navegando a:', destino);

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: destino }],
            })
          );
        } else {
          console.log('[LoginScreen] Login falló:', resultado.error);
          Alert.alert("Error", resultado.error || "Credenciales incorrectas");
        }
      } catch (error) {
        console.error('[LoginScreen] Error:', error);
        Alert.alert("Error", "Ocurrió un error al iniciar sesión");
      } finally {
        setLoading(false);
      }
    }

    useEffect(()=>{
      const timer = setTimeout(()=>{
        Animated.timing(desvanecido, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(()=> setCargando(false));

      }, 1000);
      return()=> clearTimeout(timer);
    },[]);

    if(cargando) {
      return(
        <Animated.View style={[styles.splashContainer, {opacity: desvanecido}]}>
          <ImageBackground
            source={require('../assets/Logo.png')}
            resizeMode="contain"
            style={styles.splashImage}
          >
            <Text style={styles.splashText}> Cargando </Text>
          </ImageBackground>
        </Animated.View>
      );
    }


    return (
        <ScrollView 
            contentContainerStyle={styles.background}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        > 
          <Text style={styles.titulo}>¡Bienvenido a Opina+!</Text>
            <View style={styles.loginContainer}>
                
                <Text style={styles.texto}>Correo</Text>
                <TextInput
                    style={styles.input}
                    placeholder='correo@upq.edu.mx'
                    value={correoLogin}
                    onChangeText={setCorreoLogin}
                    keyboardType='email-address'
                    autoCapitalize='none'
                /> 

                <Text style={styles.texto}>Contraseña</Text>
                <TextInput
                    style={styles.input}
                    placeholder='contraseña'
                    value={contrasenia}
                    onChangeText={setContrasenia}
                    secureTextEntry={true}
                />

                <View style={styles.cajaOpciones}>
                    <TouchableOpacity onPress={Recuperarla}>
                        <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.cajaBotones}>

                    <TouchableOpacity 
                        style={[styles.btnContinuar, loading && styles.btnDisabled]} 
                        onPress={mostrarAlertaLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.btnText}>Iniciar Sesión</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => navigation ? navigation.navigate('Register') : null}>
                        <Text style={styles.btnCancelText}>Registrarse</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </ScrollView>
    )

}

const styles = StyleSheet.create({
background: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    backgroundColor: '#ffffff',
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
    color: '#2701A9',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 60,
    fontSize: 20,
    marginTop: 400,
},
textoContainer:{
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
    color:'#000000',
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
