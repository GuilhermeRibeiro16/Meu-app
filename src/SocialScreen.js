import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { auth, db } from './firebase.config'; // Firebase config
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';

export default function SocialScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Publicações locais (imagens estáticas)
  const localPosts = [
    { id: 'local-1', title: 'Desenho de Naruto', imageUrl: require('./assets/Naruto.jpg'), user: 'Usuário A' },
    { id: 'local-2', title: 'Desenho de Goku', imageUrl: require('./assets/Goku.jpg'), user: 'Usuário B' },
    { id: 'local-3', title: 'Desenho de Leão', imageUrl:  require ('./assets/Leão.jpg' ), user: 'Usuário C' },
    { id: 'local-4', title: 'Desenho de Cachorro', imageUrl: require ('./assets/Cachorro.jpg' ), user: 'Usuário D' },
  ];

  // Carregar posts do Firestore
  const loadPosts = async () => {
    try {
      const postsRef = collection(db, 'posts'); // Supondo que os posts estão salvos em "posts"
      const querySnapshot = await getDocs(postsRef);
      const firebasePosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Combinar publicações locais com Firebase
      setPosts([...localPosts, ...firebasePosts]);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para curtir uma publicação
  const likePost = async (postId) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Erro', 'Você precisa estar logado para curtir!');
      return;
    }

    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: arrayUnion(userId), // Adiciona o usuário à lista de curtidas
      });

      Alert.alert('Curtido!', 'A publicação foi curtida.');
    } catch (error) {
      console.error('Erro ao curtir a publicação:', error);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Carregando publicações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho Principal */}
      <View style={styles.header}>
        <Text style={styles.logo}>Rabiscar</Text>
      </View>

      {/* Lista de Publicações */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            {/* Nome do Usuário */}
            <View style={styles.postHeader}>
              <Text style={styles.username}>{item.user || item.username || 'Usuário Desconhecido'}</Text>
            </View>

            {/* Imagem da Publicação */}
            <Image
              source={item.imageUrl?.uri ? { uri: item.imageUrl.uri } : item.imageUrl}
              style={styles.postImage}
            />

            {/* Título da Publicação */}
            <Text style={styles.postTitle}>{item.title}</Text>

            {/* Botões de Ação */}
            <View style={styles.postFooter}>
              <TouchableOpacity onPress={() => likePost(item.id)}>
                <Text style={styles.actionButton}>❤️ Curtir</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Comments', { postId: item.id })}>
                <Text style={styles.actionButton}>💬 Comentar</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.actionButton}>📤 Enviar</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.actionButton}>🔖 Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Rodapé Fixo */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
          <Text style={styles.footerButton}>❤️ Favoritos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 10, backgroundColor: '#f8f8f8', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ddd' },
  logo: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  post: { marginBottom: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#ddd' },
  postHeader: { padding: 10 },
  username: { fontSize: 16, fontWeight: 'bold' },
  postImage: { width: '100%', height: 300 },
  postTitle: { padding: 10, fontSize: 18, fontWeight: 'bold' },
  postFooter: { flexDirection: 'row', justifyContent: 'space-around', padding: 10 },
  actionButton: { fontSize: 16, color: '#007bff' },
  footer: { padding: 10, backgroundColor: '#f8f8f8', borderTopWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  footerButton: { fontSize: 18, fontWeight: 'bold', color: '#007bff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
