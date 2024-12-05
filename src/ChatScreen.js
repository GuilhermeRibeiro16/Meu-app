import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const ChatScreen = ({ route }) => {
  const { userName } = route.params;
  const [messages, setMessages] = useState([
    { id: '1', text: 'Olá, tudo bem ?', sender: 'other' },
    { id: '2', text: 'Eu estou bem, obrigado. e voce?', sender: 'me' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { id: Date.now().toString(), text: input, sender: 'me' }]);
      setInput('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{userName}</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escreva aqui"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // Cinza claro para o fundo
  },
  header: {
    backgroundColor: '#1d4ed8', // Azul
    padding: 15,
  },
  headerText: {
    color: '#fffa', // Texto branco
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageList: {
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#3399FF', // Azul #1d4ed8
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#1d4ed8', // Cinza claro
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#ffffff', // Branco para mensagens enviadas
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb', // Cinza claro
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#d1d5db', // Bordas cinzas
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f9fafb', // Fundo claro
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#1d4ed8', // Azul
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: '#fff', // Branco para o texto do botão
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
