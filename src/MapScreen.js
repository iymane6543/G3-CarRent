import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗺️ Localisation des véhicules</Text>
      <Text style={styles.message}>
        Voir les voitures disponibles près de chez vous
      </Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => Linking.openURL('https://www.google.com/maps/search/voiture+location+Rabat')}
      >
        <Text style={styles.buttonText}>Voir sur Google Maps</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.buttonSecondary}
        onPress={() => Linking.openURL('https://www.openstreetmap.org/?lat=34.0209&lon=-6.8498&zoom=12')}
      >
        <Text style={styles.buttonSecondaryText}>Voir sur OpenStreetMap</Text>
      </TouchableOpacity>
      
      <Text style={styles.info}>
        Les emplacements des véhicules seront disponibles dans la prochaine version.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4285F4',
    width: '80%',
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: '#4285F4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 12,
    textAlign: 'center',
    color: '#999',
    marginTop: 30,
  },
});