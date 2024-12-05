import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Button } from 'react-native';
import { db, auth } from './firebase.config'; // Importando o banco de dados e a autenticação
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Para acessar e salvar as preferências no Firestore

const preferencesData = [
  { id: '1', name: 'Anime' },
  { id: '2', name: 'Animais' },
  { id: '3', name: 'Carros' },
  { id: '4', name: 'Abstrato' },
  { id: '5', name: 'Paisagens' },
];

export default function PreferencesScreen({ navigation }) {
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    const loadPreferences = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const userPreferences = docSnap.data().preferences || [];
          setSelectedPreferences(userPreferences);
        } else {
          setSelectedPreferences([]);
        }
      }
    };
  
    loadPreferences();
  }, []);

  const togglePreference = (preference) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(selectedPreferences.filter(p => p !== preference));
    } else {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  };

  const savePreferences = async () => {
    if (selectedPreferences.length === 0) {
      Alert.alert('Erro', 'Por favor, selecione pelo menos uma preferência.');
      return;
    }

    const user = auth.currentUser;
    if (user) {
      try {
        // Salvando as preferências no Firestore
        await setDoc(doc(db, 'users', user.uid), { preferences: selectedPreferences }, { merge: true });
        Alert.alert('Sucesso', 'Preferências salvas com sucesso!');
        
        // Agora, usando reset para garantir que a navegação seja feita corretamente
        navigation.reset({
          index: 0,
          routes: [{ name: 'AppNavigator' }],
        });
      } catch (error) {
        console.error('Erro ao salvar preferências:', error);
        Alert.alert('Erro', 'Não foi possível salvar as preferências.');
      }
    } else {
      Alert.alert('Erro', 'Você precisa estar logado para salvar as preferências.');
    }
  };

  const handleSavePreferences = () => {
    console.log('Salvando preferências');
    savePreferences(); // Chamando a função de salvar preferências
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Escolha seus tipos de desenhos
      </Text>
      <FlatList
        data={preferencesData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 15,
              marginVertical: 10,
              backgroundColor: selectedPreferences.includes(item.name) ? '#87ceeb' : '#ccc',
              borderRadius: 10,
            }}
            onPress={() => togglePreference(item.name)}
          >
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={{
          backgroundColor: '#87ceeb',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
          marginTop: 20,
        }}
        onPress={handleSavePreferences}
      >
        <Text style={{ fontSize: 18, color: '#fff' }}>Salvar Preferências</Text>
      </TouchableOpacity>
    </View>
  );
}
