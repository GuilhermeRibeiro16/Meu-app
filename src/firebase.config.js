// Importar as funções necessárias do SDK Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importando apenas a autenticação
import { getFirestore } from 'firebase/firestore'; // Importando o banco de dados


// Configurações do Firebase do seu projeto
const firebaseConfig = {
  apiKey: "AIzaSyAuL_lf-siz07TKvBPzlmPxle9rcFjL4w0",
  authDomain: "login-meu-app-1b9eb.firebaseapp.com",
  projectId: "login-meu-app-1b9eb",
  storageBucket: "login-meu-app-1b9eb.appspot.com",
  messagingSenderId: "809187207629",
  appId: "1:809187207629:web:51636a70788e144c5cbc84"
};

// Inicializando o app Firebase
const app = initializeApp(firebaseConfig);

// Inicializando o serviço de autenticação e Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Exportando os serviços necessários
export { auth, db };
