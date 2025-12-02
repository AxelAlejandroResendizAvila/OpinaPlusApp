import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { initDatabase } from './database/database';
import { AuthProvider } from './context/AuthContext';

// Importar pantallas
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import ChangePasswordScreen from './Screens/ChangePasswordScreen';
import RecoverPasswordScreen from './Screens/RecoverPasswordScreen';
import HomeUserTabs from './Screens/HomeUserTabs';
import HomeAdminTabs from './Screens/HomeAdminTabs';
import CreateScreen from './Screens/CreateScreen';
import RequestScreen from './Screens/RequestScreen';
import DetailsScreen from './Screens/DetailsScreen';
import NotificationsScreen from './Screens/NotificationsScreen';
import ModScreen from './Screens/ModScreen';
import TestScreen from './Screens/TestScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initDatabase();
        setDbInitialized(true);
        console.log('Base de datos lista');
      } catch (error) {
        console.error('Error al configurar la base de datos:', error);
      }
    };

    setupDatabase();
  }, []);

  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#2701A9" />
        <Text style={{ marginTop: 20, fontSize: 18, color: '#2701A9', fontWeight: 'bold' }}>
          Inicializando...
        </Text>
      </View>
    );
  }

  return (
    <AuthProvider>
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2701A9',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ 
            title: 'Iniciar Sesión',
            headerShown: false 
          }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{ 
            title: 'Registro',
            headerShown: false 
          }}
        />
        <Stack.Screen 
          name="ChangePassword" 
          component={ChangePasswordScreen}
          options={{ 
            title: 'Cambiar Contraseña',
            headerShown: false 
          }}
        />
        <Stack.Screen 
          name="RecoverPassword" 
          component={RecoverPasswordScreen}
          options={{ 
            title: 'Recuperar Contraseña',
            headerShown: false 
          }}
        />
        <Stack.Screen 
          name="HomeUser" 
          component={HomeUserTabs}
          options={{ 
            title: 'Inicio',
            headerShown: false 
          }}
        />
        <Stack.Screen 
          name="HomeAdmin" 
          component={HomeAdminTabs}
          options={{ 
            title: 'Dashboard Admin',
            headerShown: false 
          }}
        />
        <Stack.Screen 
          name="Create" 
          component={CreateScreen}
          options={{ 
            title: 'Crear Petición',
            headerShown: true 
          }}
        />
        <Stack.Screen 
          name="Request" 
          component={RequestScreen}
          options={{ 
            title: 'Mis Solicitudes',
            headerShown: true 
          }}
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen}
          options={{ 
            title: 'Detalle de Petición',
            headerShown: true 
          }}
        />
        <Stack.Screen 
          name="Notifications" 
          component={NotificationsScreen}
          options={{ 
            title: 'Notificaciones',
            headerShown: true 
          }}
        />
        <Stack.Screen 
          name="Mod" 
          component={ModScreen}
          options={{ 
            title: 'Bandeja Moderador',
            headerShown: true 
          }}
        />
        <Stack.Screen 
          name="Test" 
          component={TestScreen}
          options={{ 
            title: 'Test',
            headerShown: true 
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({});
