
import React from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';

export default function TestScreen( {navigation} ) {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Opina +</Text>
            <Text style={styles.text}>Menu de Screens</Text>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.buttonContainer}
                showsVerticalScrollIndicator={true}
            >
                <Button color="#2701A9" onPress={()=>navigation.navigate('Login')} title='Pantalla Login'/>
                <Button color="#2701A9" onPress={()=>navigation.navigate('Register')} title='Pantalla Register'/>
                <Button color="#2701A9" onPress={()=>navigation.navigate('RecoverPassword')} title='Pantalla RecoverPassword'/>
                <Button color="#2701A9" onPress={()=>navigation.navigate('ChangePassword')} title='Pantalla ChangePassword'/>
                <Button color="#2701A9" onPress={()=>navigation.navigate('HomeUser')} title='Pantalla HomeUser'/>
                <Button color="#2701A9" onPress={()=>navigation.navigate('HomeAdmin')} title='Pantalla HomeAdmin'/>
                <Button color="#2701A9" onPress={()=>navigation.navigate('Create')} title='Pantalla Create'/>
                <Button color="#2701A9" onPress={()=>navigation.navigate('Request')} title='Pantalla Request'/>
                <Button color="#2701A9" onPress={()=>navigation.navigate('Details')} title='Pantalla Details'/>
                <Button color="#2701A9" onPress={()=>navigation.navigate('Notifications')} title='Pantalla Notifications'/>
                <Button color="#2701A9" onPress={()=>navigation.navigate('Mod')} title='Pantalla Mod'/>
            </ScrollView>
        </View>
    )
    
}

const styles = StyleSheet.create({
    title: {
        fontSize: 36,
        color: "#2701A9",
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    text: {
        fontSize: 24,
        color: "#2701A9",
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '600',
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 20,
    },
    scrollView: {
        width: '100%',
    },
    buttonContainer: {
        paddingHorizontal: '10%',
        paddingVertical: 20,
        flexDirection: "column",
        alignItems: "stretch",
        gap: 15,
    },
})