// ReservationScreen.js
// Développé par Khaoula EL MAATAOUI

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ReservationScreen = ({ route, navigation }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleConfirm = () => {
    // TODO: enregistrer dans Firestore
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réserver ce véhicule</Text>
      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirmer la réservation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title:     { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  button:    { backgroundColor: '#E94560', padding: 15, borderRadius: 8 },
  buttonText:{ color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

export default ReservationScreen;
