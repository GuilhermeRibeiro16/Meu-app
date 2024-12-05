import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase.config';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  // Carregar dados do usuário
  const loadUserData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUser({
            name: data.name,
            photoUrl: data.photoUrl,
          });
          setFollowers(data.followers || 0);
          setFollowing(data.following || 0);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  // Carregar publicações do usuário
  const loadPosts = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const postsQuery = await getDocs(
          collection(db, 'users', currentUser.uid, 'posts')
        );
        const postsData = postsQuery.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
      }
    } catch (error) {
      console.error('Erro ao carregar publicações:', error);
    }
  };

  // Função para logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login'); // Redireciona para a tela de login
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  };

  useEffect(() => {
    loadUserData();
    loadPosts();
  }, []);

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      <Text>{item.title}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity>
          <Text>Curtir</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Comentar</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho do Perfil */}
      <View style={styles.header}>
        {user?.photoUrl ? (
          <Image source={{ uri: user.photoUrl }} style={styles.profilePhoto} />
        ) : (
          <View style={styles.placeholderPhoto} />
        )}
        <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{posts.length}</Text>
            <Text>Publicações</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{followers}</Text>
            <Text>Seguidores</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{following}</Text>
            <Text>Seguindo</Text>
          </View>
        </View>
      </View>

      {/* Botões */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text>Editar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text>Compartilhar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Publicações */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        style={styles.postsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { alignItems: 'center', padding: 20, backgroundColor: '#f8f8f8' },
  profilePhoto: { width: 100, height: 100, borderRadius: 50 },
  placeholderPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
  },
  userName: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  stats: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  actionButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  logoutButton: {
    padding: 10,
    backgroundColor: '#f88',
    borderRadius: 5,
  },
  postsList: { padding: 10 },
  postContainer: { marginBottom: 20 },
  postImage: { width: '100%', height: 200, borderRadius: 10 },
  postActions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
});
