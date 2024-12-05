import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const data = {
  recent: [
    { id: '1', title: 'Desenho 1', image: require('./assets/Mario.jpg') },
    { id: '2', title: 'Desenho 2', image: require('./assets/Sonic.jpg') },
    { id: '3', title: 'Desenho 3', image: require('./assets/Panda.jpg') },
  ],
  categories: [
    { id: '1', title: 'Anime', color: '#3E64FF' },
    { id: '2', title: 'Abstrato', color: '#D946EF' },
    { id: '3', title: 'Animais', color: '#FF9F1C' },
    { id: '4', title: 'Carros', color: '#22C55E' },
  ],
  popular: [
    { id: '1', title: 'Pikachu', image: require('./assets/Pikachu.jpg') },
    { id: '2', title: 'Ash', image: require('./assets/Ash.jpg') },
    { id: '3', title: 'Charmander', image: require('./assets/Charmander.jpg') },
  ],
};

export default function ExploreScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      {/* Seção de Mais Recentes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mais recentes</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Recent')}>
          <Text style={styles.seeMore}>VER MAIS</Text>
        </TouchableOpacity>
        <FlatList
          horizontal
          data={data.recent}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.image} />
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Seção de Categorias */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorias</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
          <Text style={styles.seeMore}>VER MAIS</Text>
        </TouchableOpacity>
        <FlatList
          horizontal
          data={data.categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.category, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate(item.title)}
            >
              <Text style={styles.categoryText}>{item.title}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Seção de Popular */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Popular')}>
          <Text style={styles.seeMore}>VER MAIS</Text>
        </TouchableOpacity>
        <FlatList
          horizontal
          data={data.popular}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.image} />
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeMore: {
    fontSize: 14,
    color: '#007AFF',
    alignSelf: 'flex-end',
    marginVertical: 8,
  },
  imageContainer: {
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    width: 120,
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  category: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 20,
    marginRight: 10,
  },
  categoryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
