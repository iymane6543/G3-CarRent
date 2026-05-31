import React, { useState, useContext } from "react";
import { database } from './firebase';
import { ref, push, get, query, orderByChild, equalTo } from 'firebase/database';
import { SessionContext } from './SessionContext';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";

const back = require("./assets/icons/left-arrow.png");
const dots = require("./assets/icons/dots.png");

const image_v_1 = require("./assets/vehicles/v-1.png");
const image_v_2 = require("./assets/vehicles/v-2.png");
const image_v_3 = require("./assets/vehicles/v-3.png");
const image_v_4 = require("./assets/vehicles/v-4.png");

const InfoScreen = ({ route, navigation }) => {
  const { vehicle } = route.params;
  const { user } = useContext(SessionContext);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const getImage = (vehicle) => {
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

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date);
    hideStartDatePicker();
    showEndDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleEndDateConfirm = (date) => {
    setEndDate(date);
    hideEndDatePicker();
  };

  const checkReservationOverlap = async (start, end) => {
    const RESListRef = ref(database, 'Reservation');
    const snapshot = await get(query(RESListRef, orderByChild('voiture'), equalTo(vehicle.id)));

    if (snapshot.exists()) {
      const reservations = snapshot.val();
      for (let key in reservations) {
        const res = reservations[key];
        const resStart = new Date(res.date_debut);
        const resEnd = new Date(res.date_fin);

        if ((start >= resStart && start <= resEnd) || (end >= resStart && end <= resEnd) || (start <= resStart && end >= resEnd)) {
          return true;
        }
      }
    }
    return false;
  };

  const handleAddReservation = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to make a reservation.');
      return;
    }

    if (!startDate || !endDate) {
      Alert.alert('Error', 'Please select both start and end dates.');
      return;
    }

    const overlap = await checkReservationOverlap(startDate, endDate);
    if (overlap) {
      Alert.alert('Error', 'The car is already reserved for the selected dates.');
      return;
    }

    const newReservation = {
      voiture: vehicle.id,
      reserved_by: user.email,  
      date_debut: startDate.toISOString(),
      date_fin: endDate.toISOString(),
    };

    try {
      const RESListRef = ref(database, 'Reservation');
      await push(RESListRef, newReservation);
      Alert.alert('Success', 'Reservation added successfully.');
      // Reset dates after successful reservation
      setStartDate(null);
      setEndDate(null);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'There was an error adding the reservation.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.9}
          >
            <Image
              source={back}
              resizeMode="contain"
              style={styles.menuIconStyle}
            />
          </TouchableOpacity>
          <Text style={styles.HeaderText}>Detail</Text>
          <Image
            source={dots}
            resizeMode="contain"
            style={styles.faceIconStyle}
          />
        </View>

        <View style={styles.imageSection}>
          <Image
            source={getImage(vehicle)}
            resizeMode="contain"
            style={styles.vehicleImage}
          />
        </View>

        <View style={styles.headSection}>
          <View style={styles.topTextArea}>
            <Text style={styles.makemodelText}>
              {vehicle.make} {vehicle.model}
            </Text>
            <Text style={styles.price}>
              <Text style={styles.amount}>${vehicle.price_per_day}</Text> /day
            </Text>
          </View>
          <Text style={styles.typetranText}>
            {vehicle.type}-{vehicle.transmission}
          </Text>
        </View>

        <Text style={styles.descriptionText}>{vehicle.description}</Text>
        <Text style={styles.propertiesText}>Properties</Text>

        <View style={styles.propertiesArea}>
          <View style={styles.level}>
            <Text style={styles.propertyText}>
              Motor power:
              <Text style={styles.valueText}>
                {" "}
                {vehicle.properties?.motor_power_hp || vehicle.motor_power_hp} hp
              </Text>
            </Text>
            <Text style={styles.propertyText}>
              Engine capacity:
              <Text style={styles.valueText}>
                {" "}
                {vehicle.properties?.engine_capacity_cc || vehicle.engine_capacity_cc} cc
              </Text>
            </Text>
          </View>
          <View style={styles.level}>
            <Text style={styles.propertyText}>
              Fuel:
              <Text style={styles.valueText}>
                {" "}
                {vehicle.properties?.fuel_type || vehicle.fuel_type}
              </Text>
            </Text>

            <Text style={styles.propertyText}>
              Traction:
              <Text style={styles.valueText}>
                {" "}
                {vehicle.properties?.traction || vehicle.traction}
              </Text>
            </Text>
          </View>
        </View>

        {/* Bouton Rent a Car */}
        <TouchableOpacity style={styles.rentButton} onPress={showStartDatePicker}>
          <Text style={styles.rentButtonText}>Rent a Car</Text>
        </TouchableOpacity>

        {/* Sélecteurs de dates */}
        <DateTimePickerModal
          isVisible={isStartDatePickerVisible}
          mode="date"
          onConfirm={handleStartDateConfirm}
          onCancel={hideStartDatePicker}
        />

        <DateTimePickerModal
          isVisible={isEndDatePickerVisible}
          mode="date"
          onConfirm={handleEndDateConfirm}
          onCancel={hideEndDatePicker}
        />
        
        {/* Affichage des dates sélectionnées */}
        {startDate && (
          <Text style={styles.selectedDateText}>Start Date: {startDate.toDateString()}</Text>
        )}
        {endDate && (
          <Text style={styles.selectedDateText}>End Date: {endDate.toDateString()}</Text>
        )}

        {/* Bouton Confirm Reservation - Apparaît seulement si les dates sont sélectionnées */}
        {user && startDate && endDate ? (
          <TouchableOpacity style={styles.confirmButton} onPress={handleAddReservation}>
            <Text style={styles.confirmButtonText}>Confirm Reservation</Text>
          </TouchableOpacity>
        ) : !user ? (
          <Text style={{ textAlign: 'center', marginTop: 20, color: 'red' }}>
            Please log in to make a reservation.
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default InfoScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    paddingRight: 35,
    paddingLeft: 35,
  },
  headerSection: {
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuIconStyle: {
    width: 25,
  },
  HeaderText: {
    fontSize: 20,
    marginLeft: 5,
    fontWeight: "500",
  },
  faceIconStyle: {
    width: 30,
  },

  imageSection: {
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  vehicleImage: {
    width: 300,
    height: 300,
  },

  headSection: {},
  topTextArea: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  makemodelText: {
    fontSize: 20,
    fontWeight: "500",
  },
  price: {
    fontWeight: "400",
  },
  amount: {
    fontWeight: "bold",
  },
  typetranText: {
    marginTop: 1,
    color :"#696969",
    fontWeight: "600",
    fontSize: 12,
  },
  descriptionText: {
    marginTop: 30,
    fontSize: 14,
    letterSpacing: 0.1,
    lineHeight: 18,
    color: "#696969",
    fontWeight: "500",
  },
  propertiesText: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: "500",
  },
  propertiesArea: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  level: {
    marginRight: 30,
  },
  propertyText: {
    fontSize: 12,
    color: "#696969",
  },
  valueText: {
    fontSize: 12,
    color: "black",
  },
  rentButton: {
    marginTop: 50,
    height: 40,
    alignSelf: "center",
    width: 250,
    backgroundColor: "black",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rentButtonText: {
    color: "white",
    fontWeight: "500",
  },
  selectedDateText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  confirmButton: {
    marginTop: 20,
    height: 40,
    alignSelf: "center",
    width: 250,
    backgroundColor: "green",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "500",
  },
});