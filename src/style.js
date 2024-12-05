import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#3399FF'
    },
    subtitle: {
      fontSize: 14,
      textAlign: 'center',
      color: '#888',
      marginBottom: 20,
    },
    input: {
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    passwordContainer: {
      paddingVertical: 15,
      borderRadius: 5,
      marginBottom: 10,
    },
    showPassword: {
      color: 'blue',
      fontWeight: 'bold',
      marginLeft: 10,
    },
    forgotPassword: {
      color: '#007BFF',
      marginLeft: 10,
      marginBottom: 15,
    },
    loginButton: {
      backgroundColor: '#007BFF',
      paddingVertical: 15,
      borderRadius: 5,
      marginBottom: 10,
    },
    loginButtonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    divisor: {
      marginTop: '8%',
      marginBottom:'8%',
      flexDirection: "row",
      width: '90%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    divisorLine: {
      width: '45%', // Corrigido de 'widt' para 'width'
      height: 2,
      backgroundColor: '#EFEDED',
      borderRadius: 5,
    },
    googleButton: {
      backgroundColor: '#f5f5f5',
      flexDirection: 'row', // Alinha ícone e texto lado a lado
      alignItems: 'center', // Alinha verticalmente no centro
      paddingVertical: 15,
      borderRadius: 5,
      marginBottom: 10,
      justifyContent: 'center', // Centraliza horizontalmente
    },
    googleButtonText: {
      color: '#000',
      fontWeight: 'bold',
      marginLeft: 10, // Espaço entre ícone e texto
    },
    appleButton: {
      backgroundColor: '#000',
      paddingVertical: 15,
      borderRadius: 5,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center', // Centraliza o conteúdo
    },
    appleIcon: {
      marginRight: 10, // Espaço entre o ícone e o texto
    },
    appleButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    signUpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    },
    signUpText: {
      color: '#007BFF',
      fontWeight: 'bold',
    },
  });