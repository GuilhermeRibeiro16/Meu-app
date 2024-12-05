import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatListScreen from './ChatListScreen';
import ChatScreen from './ChatScreen';

const Stack = createStackNavigator();

const ChatNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ChatList">
      <Stack.Screen 
        name="ChatList" 
        component={ChatListScreen} 
        options={{ title: 'Chats' }} 
      />
      <Stack.Screen 
        name="ChatScreen" 
        component={ChatScreen} 
        options={({ route }) => ({ title: route.params.userName || 'Chat' })} 
      />
    </Stack.Navigator>
  );
};

export default ChatNavigator;
