import React, { useEffect, useState, useContext } from "react";
import { ScrollView, View, Image, SafeAreaView, StyleSheet, Text } from "react-native";
import { ref, onValue, query, orderByChild, equalTo, get } from 'firebase/database';
import { database } from './firebase';
import { SessionContext } from './SessionContext';

const image_v_1 = require("./assets/vehicles/v-1.png");
const image_v_2 = require("./assets/vehicles/v-2.png");
const image_v_3 = require("./assets/vehicles/v-3.png");
const image_v_4 = require("./assets/vehicles/v-4.png");

const SavedScreen = () => {
  const [reservations, setReservations] = useState([]);
  const [vehicles, setVehicles] = useState({});
  const { user } = useContext(SessionContext);

  useEffect(() => {
    if (!user) return;

    const fetchReservations = async () => {
      const reservationsRef = ref(database, 'Reservation');
      const reservationsQuery = query(reservationsRef, orderByChild('reserved_by'), equalTo(user.email));

      onValue(reservationsQuery, async (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const reservationsArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setReservations(reservationsArray);

          const vehicleIds = [...new Set(reservationsArray.map(res => res.voiture))];
          const vehiclesData = {};
          
          for (const vehicleId of vehicleIds) {
            const vehicleSnapshot = await get(ref(database, `cars/${vehicleId}`));
            if (vehicleSnapshot.exists()) {
              vehiclesData[vehicleId] = vehicleSnapshot.val();
            }
          }
          setVehicles(vehiclesData);
        } else {
          setReservations([]);
        }
      });
    };

    fetchReservations();
  }, [user]);

  const getImage = (vehicle) => {
    if (!vehicle) return null;
    switch(vehicle.id) {
      case 1:
        return image_v_1;
      case 2:
        return image_v_2;
      case 3:
        return image_v_3;
      case 4:
        return image_v_4;
      default:
        return vehicle.image && vehicle.image.startsWith('http') ? { uri: vehicle.image } : require('./assets/noimage.png');
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>My Reservations</Text>
          <Text style={styles.emptyText}>Please log in to see your reservations.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>My Reservations</Text>
        <ScrollView style={styles.elementPallet} contentContainerStyle={styles.scrollViewContent}>
          {reservations.length === 0 ? (
            <Text style={styles.emptyText}>No reservations found. Rent a car to get started!</Text>
          ) : (
            reservations.map((reservation) => {
              const vehicle = vehicles[reservation.voiture];
              return vehicle ? (
                <View style={styles.element} key={reservation.id}>
                  <View style={styles.infoArea}>
                    <Text style={styles.infoTitle}>{vehicle.make} {vehicle.model}</Text>
                    <Text style={styles.infoSub}>From: {new Date(reservation.date_debut).toLocaleDateString()}</Text>
                    <Text style={styles.infoSub}>To: {new Date(reservation.date_fin).toLocaleDateString()}</Text>
                    <Text style={styles.infoSub}>Type: {vehicle.type} - {vehicle.transmission}</Text>
                    <Text style={styles.infoPrice}>
                      <Text style={styles.infoAmount}>${vehicle.price_per_day} </Text>/day
                    </Text>
                  </View>
                  <View style={styles.imageArea}>
                    <Image
                      source={getImage(vehicle)}
                      resizeMode="contain"
                      style={styles.vehicleImage}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.element} key={reservation.id}>
                  <Text style={styles.infoTitle}>Loading vehicle details...</Text>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SavedScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#e7e7e7",
  },
  container: {
    flex: 1,
    paddingRight: 35,
    paddingLeft: 35,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 15,
  },
  elementPallet: {
    marginLeft: -15,
    paddingLeft: 15,
    paddingRight: 15,
    width: "110%",
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  element: {
    height: 150,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "white",
    flexDirection: "row",
    marginBottom: 13,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  infoArea: {
    flex: 2,
    paddingRight: 10,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  infoSub: {
    fontSize: 11,
    fontWeight: "600",
    color: "#696969",
  },
  infoPrice: {
    position: "absolute",
    bottom: 0,
    fontSize: 10,
    color: "#696969",
    fontWeight: "bold",
  },
  infoAmount: {
    fontSize: 12,
    color: "black",
    fontWeight: "600",
  },
  imageArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleImage: {
    width: "100%",
    height: "100%",
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
});