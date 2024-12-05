import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { styles } from './style'; // Reutilize o estilo ou crie um novo
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Importar funções do Firestore
import { auth, db } from './firebase.config'; // Certifique-se de que o caminho esteja correto

export default function NewUser({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const [loading, setLoading] = useState(false); // Variável para controle do carregamento

  const handleSignUp = async () => {
    // Verificar se algum campo está vazio
    if (!email || !password || !repassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    // Verificar se as senhas coincidem
    if (password !== repassword) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    setLoading(true); // Inicia o carregamento

    try {
      // Lógica de criação do usuário no Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Adiciona dados do usuário no Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        preferences: [], // Se você tiver preferências ou outros dados, adicione aqui
        createdAt: new Date(),
      });

      Alert.alert('Sucesso', 'Usuário criado com sucesso! Faça o login.');
      setLoading(false); // Finaliza o carregamento
      navigation.navigate('Login'); // Redireciona para a tela de login
    } catch (error) {
      const errorMessage = error.message;
      setLoading(false); // Finaliza o carregamento
      Alert.alert('Erro', 'Erro ao criar usuário: ' + errorMessage); // Mensagem de erro
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Novo Usuário</Text>

      <TextInput
        style={styles.input}
        placeholder="Email de usuário"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha de usuário"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        secureTextEntry
        value={repassword}
        onChangeText={setRePassword}
      />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleSignUp}
        disabled={loading} // Desativa o botão durante o carregamento
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" /> // Ícone de carregamento
        ) : (
          <Text style={styles.loginButtonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
