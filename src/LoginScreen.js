import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import { auth, db } from './firebase.config'; // Firebase
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { styles } from './style';

// Constantes para as rotas
const ROUTES = {
  PREFERENCES: 'Preferences',
  APP_NAVIGATOR: 'AppNavigator',
  NEW_USER: 'NewUser',
};

export default function LoginScreen({ navigation, onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID', // Substitua com seu Client ID do Google
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(async () => {
          console.log('Login com Google realizado!');
          await createUserProfile(auth.currentUser); // Cria ou atualiza o perfil do usuário
          onLoginSuccess();
          checkUserPreferences(); // Verifica as preferências do usuário
        })
        .catch((error) => {
          console.error('Erro ao fazer login com Google:', error);
          Alert.alert('Erro', `Erro ao realizar login com Google: ${error.message}`);
        });
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    console.log('Tentando fazer login com:', email);
    setLoading(true);

    try {
      // Login com email e senha
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Criar ou atualizar o perfil do usuário no Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          name: user.displayName || 'Usuário',
          photoUrl: user.photoURL || null,
          followers: 0,
          following: 0,
        },
        { merge: true } // Evita sobrescrever dados existentes
      );

      console.log('Login realizado com sucesso e perfil atualizado no Firestore.');
      setLoading(false);

      // Redireciona para a próxima tela
      onLoginSuccess();
      navigation.replace(ROUTES.APP_NAVIGATOR);
    } catch (error) {
      console.error('Erro no login:', error);
      setLoading(false);
      Alert.alert('Erro', 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const createUserProfile = async (user) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Cria um novo perfil se ainda não existir
        await setDoc(userDocRef, {
          name: user.displayName || 'Usuário',
          photoUrl: user.photoURL || null,
          followers: 0,
          following: 0,
          preferences: [], // Inicializa com preferências vazias
        });
        console.log('Perfil do usuário criado no Firestore.');
      } else {
        console.log('Perfil já existe no Firestore.');
      }
    } catch (error) {
      console.error('Erro ao criar o perfil do usuário:', error);
    }
  };

  const checkUserPreferences = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.preferences && userData.preferences.length > 0) {
            console.log('Preferências encontradas:', userData.preferences);
            navigation.replace(ROUTES.APP_NAVIGATOR); // Vai para o feed
          } else {
            console.log('Sem preferências, redirecionando para Preferences.');
            navigation.replace(ROUTES.PREFERENCES); // Redireciona para as preferências
          }
        } else {
          console.log('Usuário não encontrado, redirecionando para Preferences.');
          navigation.replace(ROUTES.PREFERENCES);
        }
      } catch (error) {
        console.error('Erro ao verificar preferências:', error);
        Alert.alert('Erro', 'Não foi possível carregar as preferências.');
      }
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira o e-mail associado à sua conta.');
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() =>
        Alert.alert(
          'E-mail enviado',
          `Um e-mail para redefinir sua senha foi enviado para ${email}. Verifique sua caixa de entrada.`
        )
      )
      .catch((error) => {
        console.error(error);
        Alert.alert('Erro', 'Ocorreu um erro ao tentar redefinir a senha.');
      });
  };

  const handleGoogleSignIn = () => {
    promptAsync();
  };

  const handleAppleSignIn = () => {
    Alert.alert('Função não implementada', 'Login com Apple ainda não está implementado.');
  };

  const handleSignUp = () => {
    navigation.navigate(ROUTES.NEW_USER);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Rabiscar</Text>
          <Text style={styles.subtitle}>Transforme-se em um artista profissional.</Text>

          <TextInput
            style={styles.input}
            placeholder="Email ou Telefone"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              autoCapitalize="none"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.showPassword}>
                {showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, { opacity: loading ? 0.5 : 1 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Acessar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divisor}>
            <View style={styles.divisorLine}></View>
            <Text style={{ marginHorizontal: '3%' }}>ou</Text>
            <View style={styles.divisorLine}></View>
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
            <FontAwesome name="google" size={24} color="black" />
            <Text style={styles.googleButtonText}>Continue com Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.appleButton} onPress={handleAppleSignIn}>
            <FontAwesome name="apple" size={24} color="white" style={styles.appleIcon} />
            <Text style={styles.appleButtonText}>Continue com Apple</Text>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text>Novo no Rabiscar? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpText}>Entre Agora</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
