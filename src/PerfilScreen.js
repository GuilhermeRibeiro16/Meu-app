import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TextInput,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from './firebase.config';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

const PROFILE_PATH = FileSystem.documentDirectory + 'profileData.json';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');

  // Carregar dados do usuário
  const loadUserData = async () => {
    try {
      const fileExists = await FileSystem.getInfoAsync(PROFILE_PATH);
      if (fileExists.exists) {
        const fileData = await FileSystem.readAsStringAsync(PROFILE_PATH);
        const parsedData = JSON.parse(fileData);
        setUser({
          name: parsedData.name,
          photoUrl: parsedData.photoUrl,
        });
        setFollowers(parsedData.followers || 0);
        setFollowing(parsedData.following || 0);
      } else {
        setUser({ name: 'Guilherme', photoUrl: null });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };
  // Carregar publicações do usuário
  const loadPosts = async () => {
    try {
      const postsFile = FileSystem.documentDirectory + 'posts.json';
      const fileExists = await FileSystem.getInfoAsync(postsFile);
      if (fileExists.exists) {
        const postsData = await FileSystem.readAsStringAsync(postsFile);
        setPosts(JSON.parse(postsData));
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Erro ao carregar publicações:', error);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permissão para acessar a galeria é necessária!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
    }
  };
  // Função para salvar a imagem no sistema de arquivos
  const uploadImage = async () => {
    if (!selectedImage || !description) {
      alert('Por favor, selecione uma imagem e adicione uma descrição.');
      return;
    }
    try {
      const newPost = {
        image: selectedImage,
        description: description,
        user: auth.currentUser?.email || 'Usuário Anônimo',
        timestamp: new Date(),
      };

      // Salvar o post no sistema de arquivos
      const postsFile = FileSystem.documentDirectory + 'posts.json';
      const fileExists = await FileSystem.getInfoAsync(postsFile);
      let postsData = [];
      if (fileExists.exists) {
        const existingData = await FileSystem.readAsStringAsync(postsFile);
        postsData = JSON.parse(existingData);
      }

      postsData.push(newPost);
      await FileSystem.writeAsStringAsync(postsFile, JSON.stringify(postsData));

      alert('Imagem enviada com sucesso!');
      setSelectedImage(null);
      setDescription('');
      loadPosts();
    } catch (error) {
      console.error('Erro ao enviar a imagem:', error);
      alert('Falha ao enviar a imagem.');
    }
  };

  // Função para logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login'); // Redireciona para a tela de login
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Logout', 'Você saiu da conta.');
    }
  };

  useEffect(() => {
    loadUserData();
    loadPosts();
  }, []);

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
        <Image source={{ uri: item.image }} style={styles.postImage} />
      <Text>{item.description}</Text>
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

      {/* Botão para escolher a imagem */}
      <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}> Publicar Desenho</Text>
      </TouchableOpacity>

      {/* Input para a descrição */}
      {selectedImage && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Descrição da imagem"
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity onPress={uploadImage} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Publicar</Text>
          </TouchableOpacity>
        </View>
      )}

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
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: { 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#f8f8f8' 
  },
  profilePhoto: { 
    width: 100, 
    height: 100, 
    borderRadius: 50 
  },
  placeholderPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
  },
  userName: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginVertical: 10 
  },
  stats: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '100%' 
  },
  stat: { 
    alignItems: 'center' 
  },
  statValue: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
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
  postsList: { 
    flex: 1, // Ajusta o FlatList para ocupar o espaço restante acima do rodapé
    padding: 10 
  },
  postContainer: { 
    marginBottom: 20 
  },
  postImage: { 
    width: '100%', 
    height: 200, 
    borderRadius: 10 
  },
  postActions: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 10 
  },
  uploadButton: { 
    padding: 15, 
    backgroundColor: '#4CAF50', 
    alignItems: 'center', 
  },
  uploadButtonText: { 
    color: '#fff', 
    fontSize: 18 
  },
  inputContainer: { 
    padding: 10 
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
});
