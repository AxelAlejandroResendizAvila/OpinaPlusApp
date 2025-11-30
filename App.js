import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importar pantallas
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import ChangePasswordScreen from './Screens/ChangePasswordScreen';
import RecoverPasswordScreen from './Screens/RecoverPasswordScreen';
import HomeUserTabs from './Screens/HomeUserTabs';
import HomeAdminScreen from './Screens/HomeAdminScreen';
import CreateScreen from './Screens/CreateScreen';
import RequestScreen from './Screens/RequestScreen';
import DetailsScreen from './Screens/DetailsScreen';
import NotificationsScreen from './Screens/NotificationsScreen';
import ModScreen from './Screens/ModScreen';
import TestScreen from './Screens/TestScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName="Test"
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
          component={HomeAdminScreen}
          options={{ 
            title: 'Dashboard Admin',
            headerShown: true 
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
  );
}

const styles = StyleSheet.create({});
