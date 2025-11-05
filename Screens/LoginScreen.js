import { Text, StyleSheet, View, ImageBackground, Animated, Easing, TouchableOpacity, TextInput, Alert , Switch} from 'react-native'
import React,{ useEffect, useState } from 'react';

export default function LoginScreen() {
    const [cargando, setCargando] = useState(true);
    const desvanecido = new Animated.Value(1);
    const [nombre, setNombre] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [contraseniaConfirm, setContraseniaConfirm] = useState('');
    const [correoLogin, setCorreoLogin] = useState('');
    const [correo, setCorreo] = useState('');
    const [esEncendido, cambiarEncendido] = useState(false);
    const [correoError, setCorreoError] = useState(false);
    const [mostrarLogin, setMostrarLogin] = useState(true);

   const Recuperarla = () => {
    Alert.alert("Recuperar Contraseña","Se ha enviado un correo para recuperar tu contraseña");
   }

    
    const mostrarAlertaLogin = () => {
        const validateCorreo = (correoLogin) => {
        // Expresión regular básica para validar el formato del correo
        const CorreoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (CorreoRegex.test(correoLogin)) {
          setCorreoError(false);
        } else {
          setCorreoError(true);
        }
      };
      validateCorreo(correoLogin);
      if(contrasenia.trim() === '' && correoLogin.trim() === ''){    
        Alert.alert("Error, favor de llenar todos los campos (Móvil)");
        alert("Favor de llenar todos los campos (Web)");
      }else if(contrasenia.trim() === '') {
        Alert.alert("Error, favor de llenar el campo de la contraseña(Móvil)");
        alert("Favor de llenar el campo de la contraseña (Web)");
      }else if( correoLogin.trim() === ''){
        Alert.alert("Error, favor de llenar el campo del correo(Móvil)");
        alert("Favor de llenar el campo del correo (Web)"); 
      }else if(correoError){
         Alert.alert("Error, ingresa un correo valido(Móvil)");
        alert("Favor de ingresar un correo valido(Web)");
      }else {
            //Alert para móvil
        Alert.alert(`Inicio de sesión exitoso`,`correo: ${correoLogin}\nContraseña: ${contrasenia}`
        );
        //Alert para web
        alert(`Inicio de sesión exitoso\n
          correo: ${correoLogin}\n
          Contraseña: ${contrasenia}\n`
        );

      }
    }

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
        if( nombre.trim() === '' && contrasenia.trim() === '' && correo.trim() === '' && contraseniaConfirm.trim() === ''){    
        Alert.alert("Error, favor de llenar todos los campos (Móvil)");
        alert("Favor de llenar todos los campos (Web)");
      }else if( nombre.trim() === ''){
        Alert.alert("Error, favor de llenar el campo del nombre(Móvil)");
        alert("Favor de llenar el campo del nombre (Web)");
      }else if(contrasenia.trim() === '') {
        Alert.alert("Error, favor de llenar el campo de la contraseña(Móvil)");
        alert("Favor de llenar el campo de la contraseña (Web)");
      }else if( contraseniaConfirm.trim() === ''){
        Alert.alert("Error, favor de llenar el campo de confirmación de la contraseña(Móvil)");
        alert("Favor de llenar el campo de confirmación de la contraseña (Web)");
      }else if( correo.trim() === ''){
        Alert.alert("Error, favor de llenar el campo del correo(Móvil)");
        alert("Favor de llenar el campo del correo (Web)");
      }else if(esEncendido === false){
        Alert.alert("Error, favor de aceptar los términos y condiciones(Móvil)");
        alert("Favor de aceptar los términos y condiciones(Web)");
      }else if(contrasenia !== contraseniaConfirm){
        Alert.alert("Error, las contraseñas no coinciden(Móvil)");
        alert("Las contraseñas no coinciden(Web)");
      }else if(correoError){
         Alert.alert("Error, ingresa un correo valido(Móvil)");
        alert("Favor de ingresar un correo valido(Web)");
      }else {
         //Alert para móvil
        Alert.alert(`Registro exitoso`,`Nombre: ${nombre}\ncorreo: ${correo}`
        );
        //Alert para web
        alert(`Registro exitoso\n
          Nombre: ${nombre}\n
          correo: ${correo}\n`
        );
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
            resizeMode='contain'
            style={styles.splashImage}
          >
            <Text style={styles.splashText}> Cargando </Text>
          </ImageBackground>
        </Animated.View>
      );
    }


    return (
        <ImageBackground
            source={require('../assets/BG1.png')}
            resizeMode='cover'
            style={styles.background}
        > 
            {mostrarLogin && (
                <View style={styles.loginContainer}>
                    <Text style={styles.titulo}>Inicia Sesión</Text>
                    
                    <TextInput
                        style={styles.input}
                        placeholder='correo@ejemplo.com'
                        value={correoLogin}
                        onChangeText={setCorreoLogin}
                    /> 

                    <TextInput
                        style={styles.input}
                        placeholder='contraseña'
                        value={contrasenia}
                        onChangeText={setContrasenia}
                        secureTextEntry={true}
                    />

                    <View style={styles.cajaOpciones}>
                        <Text style={styles.etiquetas}> ¿Olvidaste tu contraseña? </Text>
                        <TouchableOpacity onPress={Recuperarla}>
                            <Text style={styles.link}>Recuperarla</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.cajaBotones}>
                        <TouchableOpacity style={styles.btn} onPress={()=> setMostrarLogin(false)}>
                            <Text style={styles.btnText}>Crear Cuenta</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnContinuar} onPress={mostrarAlertaLogin}>
                            <Text style={styles.btnText}>Continuar</Text>
                        </TouchableOpacity>
                    </View>


                </View>
            )}


            {!mostrarLogin && (
                <View style={styles.loginContainer}>
                    <TouchableOpacity>
                        <Text style={styles.etiquetas} onPress={()=> setMostrarLogin(true)}>Volver</Text>
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
                            onValueChange={ () => cambiarEncendido(!esEncendido) }
                            trackColor={{true: '#5170ff', false: 'gray'}}
                        >

                        </Switch>
                    </View>
                    <TouchableOpacity style={styles.btnContinuar} onPress={mostrarAlertaRegistro}>
                        <Text style={styles.btnText}>Continuar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ImageBackground>
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
    color: 'white',
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
textoContainer:{
    backgroundColor: 'black',
    padding: 20,
},
container: {
    flex: 1, // Ocupa toda la pantalla
    backgroundColor: '#555555ff', // Color de fondo gris oscuro
    alignItems: 'center', // Centra los elementos horizontalmente
    justifyContent: 'center', // Centra los elementos verticalmente
},
titulo: {
    fontSize: 32, // Tamaño de fuente grande para el título
    color: '#5170ff', // Color blanco para el título
    fontWeight: 'bold', // Negrita para el título
    marginBottom: 20, // Espacio debajo del título
},
etiquetas: {
    fontSize: 12, // Tamaño de fuente más grande para las etiquetas
    color: '#ffffffe0', // Color blanco para las etiquetas
    justifyContent: 'center',
    marginBottom: 10, // Espacio debajo de cada etiqueta

},
input: {
    
    width: '100%', // Ajusta el ancho según sea necesario
    color: '#ffffffc9',
    borderWidth: 2, // Grosor del borde
    borderColor: '#ffffff81', // Color del borde
    borderRadius: 8, // Bordes redondeados
    padding: 10, // Espaciado interno
    marginBottom: 10, // Espaciado inferior
    backgroundColor: '#afafaf33', // Color de fondo
},
loginContainer: {
    backgroundColor: '#4a4a4a52',
    width: '80%',
    padding: 20,
    borderRadius: 10,
},
cajaTerminos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
},
cajaOpciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
},
cajaBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
},
btn: {
    backgroundColor: "#00000070",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15
},
btnContinuar: {
    backgroundColor: "#5170ff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15
},
btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
},
link: {
    color: "#4dabff",
    fontSize: 14,
    textDecorationLine: "underline" 
}

})
