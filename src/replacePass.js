import { sendPasswordResetEmail } from "firebase/auth";
import { Alert, TextInput, TouchableOpacity, Text } from "react-native";
import { auth } from "./src/firebase.config"; // Certifique-se de que o Firebase está configurado corretamente.

const handleForgotPassword = (email) => {
  if (!email) {
    Alert.alert("Erro", "Por favor, insira o e-mail.");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      Alert.alert(
        "E-mail enviado",
        "Um e-mail para redefinir sua senha foi enviado para " + email
      );
    })
    .catch((error) => {
      console.error(error);
      switch (error.code) {
        case "auth/invalid-email":
          Alert.alert("Erro", "O e-mail inserido não é válido.");
          break;
        case "auth/user-not-found":
          Alert.alert("Erro", "Usuário não encontrado com esse e-mail.");
          break;
        default:
          Alert.alert("Erro", "Ocorreu um erro. Tente novamente.");
      }
    });
};
