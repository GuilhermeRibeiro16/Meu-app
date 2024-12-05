import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/LoginScreen';
import PreferencesScreen from './src/PreferencesScreen';
import NewUserScreen from './src/NewUserScreen';
import AppNavigator from './src/AppNavigator';
import PerfilScreen from './src/PerfilScreen';
import { auth } from './src/firebase.config'; // Importando Firebase Authentication

// Constantes para as rotas
const ROUTES = {
  LOGIN: 'Login',
  PREFERENCES: 'Preferences',
  APP_NAVIGATOR: 'AppNavigator',
  NEW_USER: 'NewUser',
  USER: 'User',
};

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uid, setUid] = useState(null); // Armazena o UID do usuário autenticado

  useEffect(() => {
    // Monitora mudanças no estado de autenticação
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user); // Log para depuração
      if (user) {
        setUid(user.uid); // Salva o UID do usuário logado
        setIsLoggedIn(true); // Atualiza o estado de login
      } else {
        setUid(null);
        setIsLoggedIn(false); // Atualiza o estado de logout
      }
    });

    return () => unsubscribe(); // Cancela o evento ao desmontar o componente
  }, []);

  if (isLoggedIn) {
    console.log('Usuário logado, redirecionando para o AppNavigator'); // Log de depuração
    return <AppNavigator uid={uid} />; // Passa o UID para o AppNavigator
  }

  console.log('Usuário não logado, mostrando a tela de login'); // Log de depuração
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={ROUTES.LOGIN}>
        <Stack.Screen name={ROUTES.LOGIN}>
          {props => (
            <LoginScreen {...props} onLoginSuccess={() => setIsLoggedIn(true)} />
          )}
        </Stack.Screen>
        <Stack.Screen name={ROUTES.PREFERENCES} component={PreferencesScreen} />
        <Stack.Screen name={ROUTES.NEW_USER} component={NewUserScreen} />
        <Stack.Screen name={ROUTES.USER} component={PerfilScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
