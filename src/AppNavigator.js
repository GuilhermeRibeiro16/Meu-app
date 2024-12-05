import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import FeedNavigator from './FeedNavigator'; // Adicionando o FeedNavigator
import SearchScreen from './SearchScreen';
import PerfilScreen from './PerfilScreen';
import ChatNavigator from './ChatNavigator';
import SocialScreen from './SocialScreen';
import { Ionicons } from '@expo/vector-icons';


// Constantes para as rotas
const ROUTES = {
  FEED: 'Feed',
  SEARCH: 'Search',
  SOCIAL: 'Social',
  CHAT: 'Chat',
  USER: 'User',
};

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  console.log('AppNavigator iniciado'); // Log para depuração

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={ROUTES.FEED} // Usando constante de rota
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            // Usando as constantes de rota para selecionar o ícone
            if (route.name === ROUTES.FEED) {
              iconName = 'pencil';
            } else if (route.name === ROUTES.SEARCH) {
              iconName = 'search';                           
            } else if (route.name === ROUTES.SOCIAL) {
              iconName = 'add-circle';             
            } else if (route.name === ROUTES.USER) {
              iconName = 'person';
            } else if (route.name === ROUTES.CHAT) {
              iconName = 'chatbubble';
            }

            console.log(`Icone para a rota ${route.name}: ${iconName}`); // Log para depuração

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name={ROUTES.FEED} component={FeedNavigator} />
        <Tab.Screen name={ROUTES.SEARCH} component={SearchScreen} />
        <Tab.Screen name={ROUTES.SOCIAL} component={SocialScreen} />
        <Tab.Screen name={ROUTES.CHAT} component={ChatNavigator} />
        <Tab.Screen name={ROUTES.USER} component={PerfilScreen} />

      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
