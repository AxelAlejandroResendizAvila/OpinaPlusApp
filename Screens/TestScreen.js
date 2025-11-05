
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import CreateScreen from './CreateScreen';
import DetailsScreen from './DetailsScreen';
import HomeAdminScreen from './HomeAdminScreen';
import HomeUserScreen from './HomeUserScreen';
import LoginScreen from './LoginScreen';
import ModScreen from './ModScreen';
import NotificationsScreen from './NotificationsScreen';
import RequestScreen from './RequestScreen';


export default function TestScreen() {
    const[screen, setScreen] = useState('menu');

    switch(screen) {
        case 'Create':
            return <CreateScreen />;
        case 'Details':
            return <DetailsScreen />;
        case 'HomeAdmin':
            return <HomeAdminScreen />;
        case 'HomeUser':
            return <HomeUserScreen />;
        case 'Login':
            return <LoginScreen />;
        case 'Mod':
            return <ModScreen />;
        case 'Notifications':
            return <NotificationsScreen />;
        case 'Request':
            return <RequestScreen />;
            default:
                return (
                    <View style={styles.container}>
                        <Text style={styles.title}>Opina +</Text>
                        <Text style={styles.text}>Menu de Screens</Text>
                        <View style={styles.buttonContainer}>
                            <Button color="#5170ff" onPress={()=>setScreen('Create')} title='Pantalla Create'/>
                            <Button color="#5170ff" onPress={()=>setScreen('Details')} title='Pantalla Details'/>
                            <Button color="#5170ff" onPress={()=>setScreen('HomeAdmin')} title='Pantalla HomeAdmin'/>
                            <Button color="#5170ff" onPress={()=>setScreen('HomeUser')} title='Pantalla HomeUser'/>
                            <Button color="#5170ff" onPress={()=>setScreen('Login')} title='Pantalla Login'/>
                            <Button color="#5170ff" onPress={()=>setScreen('Mod')} title='Pantalla Mod'/>
                            <Button color="#5170ff" onPress={()=>setScreen('Notifications')} title='Pantalla Notifications'/>
                            <Button color="#5170ff" onPress={()=>setScreen('Request')} title='Pantalla Request'/>
                    
                        </View>
                    </View>
                )
    }
}

const styles = StyleSheet.create({
    title: {
        fontFamily: "monospace", 
        fontSize: 60, //Tamaño de la letra
        color: "#ffffffff",
        textAlign: 'center',
        marginBottom: 20, //Margen inferior
    },
    text: {
        fontFamily: "monospace", 
        fontSize: 40, //Tamaño de la letra
        color: "#ffffffff",
        textAlign: 'center',
        
    },
    container: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        marginTop: 20, //Margen superior
        flexDirection: "column", //Alineación vertical
        justifyContent: "space-between", //Separación entre Details
        width: "80%",
        gap: 20,
    },
})