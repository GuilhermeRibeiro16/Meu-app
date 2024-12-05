import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

const users = [
  { id: '1', name: 'Wesley Gomes', avatar: 'https://via.placeholder.com/50' },
  { id: '2', name: 'Janderson Souza', avatar: 'https://via.placeholder.com/50' },
  { id: '3', name: 'Gustavo Ferreira', avatar: 'https://via.placeholder.com/50' },
];

const ChatList = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userContainer}
            onPress={() => navigation.navigate('ChatScreen', { userName: item.name })}
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.userName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Fundo branco
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // Separador cinza claro
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25, // Avatar redondo
    marginRight: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1d4ed8', // Azul para o texto
  },
});

export default ChatList;
