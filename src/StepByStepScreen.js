import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function StepByStepScreen({ route, navigation }) {
  const { drawing } = route.params; // Dados do desenho
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 1, description: 'Comece a desenhar o chapéu e o cabelo.', image: require('./assets/step1.jpg') },
    { id: 2, description: 'Adicione os olhos e os detalhes.', image: require('./assets/step2.jpg') },
    { id: 3, description: 'Finalize os traços e contornos.', image: require('./assets/step3.jpg') },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSave = () => {
    Alert.alert('Sucesso!', 'Desenho salvo com sucesso!');
    // Aqui você pode integrar a lógica de salvar no Firebase ou armazenamento local
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>{drawing.title}</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Salvar</Text>
        </TouchableOpacity>
      </View>

      {/* Imagem e descrição do passo */}
      <Image source={steps[currentStep].image} style={styles.image} />
      <Text style={styles.description}>{steps[currentStep].description}</Text>

      {/* Navegação entre os passos */}
      <View style={styles.navigation}>
        <TouchableOpacity onPress={handlePrev} disabled={currentStep === 0}>
          <Text style={[styles.navButton, currentStep === 0 && styles.disabled]}>⟵</Text>
        </TouchableOpacity>
        <Text>
          Passo {currentStep + 1} de {steps.length}
        </Text>
        <TouchableOpacity onPress={handleNext} disabled={currentStep === steps.length - 1}>
          <Text style={[styles.navButton, currentStep === steps.length - 1 && styles.disabled]}>⟶</Text>
        </TouchableOpacity>
      </View>

      {/* Botão para voltar ao feed */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Voltar para o Feed</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  saveButton: { fontSize: 18, color: 'blue' },
  image: { width: '100%', height: 300, resizeMode: 'contain', marginVertical: 20 },
  description: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  navigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  navButton: { fontSize: 32, fontWeight: 'bold', color: 'blue' },
  disabled: { color: 'gray' },
  backButton: { backgroundColor: 'blue', padding: 10, borderRadius: 5 },
  backButtonText: { color: 'white', textAlign: 'center', fontSize: 16 },
});
