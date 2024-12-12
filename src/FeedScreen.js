import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

export default function FeedScreen({ navigation }) {
  // Estado do feed e preferências
  const [preferences, setPreferences] = useState(['Anime', 'Animais', 'Carros', 'Abstrato', 'Paisagens']); // Preferências iniciais
  const [feedData, setFeedData] = useState([]);
  const [filteredFeed, setFilteredFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dados do feed
  const initialFeedData = {
    Anime: [
      { id: '1', title: 'Desenho de Naruto', imageUrl: require('./assets/Naruto.jpg') },
      { id: '2', title: 'Desenho de Goku', imageUrl: require('./assets/Goku.jpg') },
      { id: '11', title: 'Desenho de ash', imageUrl: require('./assets/Ash1.jpg') },
    ],
    Animais: [
      { id: '3', title: 'Desenho de Leão', imageUrl: require('./assets/Leão.jpg') },
      { id: '4', title: 'Desenho de Cachorro', imageUrl: require('./assets/Cachorro.jpg') },
    ],
    Carros: [
      { id: '5', title: 'Desenho de Ferrari', imageUrl: require('./assets/Ferrari.jpg') },
      { id: '6', title: 'Desenho de Lamborghini', imageUrl: require('./assets/Lamborghini.jpg') },
    ],
    Abstrato: [
      { id: '7', title: 'Desenho Abstrato 1', imageUrl: require('./assets/Mandala.jpg') },
      { id: '8', title: 'Desenho Abstrato 2', imageUrl: require('./assets/Mulher.jpg') },
    ],
    Paisagens: [
      { id: '9', title: 'Desenho de Montanhas', imageUrl: require('./assets/Montanha.jpg') },
      { id: '10', title: 'Desenho de Praias', imageUrl: require('./assets/Praia.jpg') },
    ],
  };

  // Simula o carregamento inicial dos dados
  useEffect(() => {
    // Junta todos os itens em uma única lista com a categoria associada
    const allFeedData = Object.keys(initialFeedData).flatMap((category) =>
      initialFeedData[category].map((item) => ({ ...item, category }))
    );

    setFeedData(allFeedData);
    setLoading(false);
  }, []);

  // Filtrar o feed com base nas preferências do usuário
  useEffect(() => {
    const filteredData = feedData.filter((item) => preferences.includes(item.category));
    setFilteredFeed(filteredData);
  }, [preferences, feedData]);

  // Exibe a tela de carregamento
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  // Exibe uma mensagem caso não haja conteúdo com base nas preferências
  if (filteredFeed.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Nenhum conteúdo disponível no momento.</Text>
      </View>
    );
  }

  // Renderiza o feed de acordo com os dados filtrados
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Feed com seus desenhos preferidos
      </Text>
      <FlatList
        data={filteredFeed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ marginBottom: 15 }}
            onPress={() => navigation.navigate('StepByStep', { drawing: item })} // Navega para a tela StepByStep
          >
            <Text style={{ fontSize: 18, marginBottom: 10 }}>{item.title}</Text>
            <Image
              source={typeof item.imageUrl === 'string' ? { uri: item.imageUrl } : item.imageUrl}
              style={{ width: '100%', height: 200, borderRadius: 10, resizeMode: 'cover' }}
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Nenhum conteúdo disponível com base nas suas preferências.
          </Text>
        )}
      />
    </View>
  );
}
