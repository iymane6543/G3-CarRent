import React, { useEffect, useState, useContext } from "react";
import { ScrollView, TouchableOpacity, Alert } from "react-native";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from './firebase'; 
import { SessionContext } from './SessionContext';

const image_v_1 = require("./assets/vehicles/v-1.png");
const image_v_2 = require("./assets/vehicles/v-2.png");
const image_v_3 = require("./assets/vehicles/v-3.png");
const image_v_4 = require("./assets/vehicles/v-4.png");

const UserCarsScreen = ({ navigation }) => {
    const [vehicles, setVehicles] = useState([]);
    const { user } = useContext(SessionContext);

    useEffect(() => {
        const carsRef = ref(database, 'cars/');
        onValue(carsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const carsArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })).filter(car => car.added_by === user.email); // Filter by user's email
                setVehicles(carsArray);
            }
        });
    }, [user.email]);

    const getImage = (vehicle) => {
        if (vehicle.image.startsWith('http')) {
            return { uri: vehicle.image };
        } else {
            return require('./assets/noimage.png');
        }
    };

    const showReservedDates = (vehicleId) => {
        const reservationsRef = ref(database, 'Reservation');
        const reservationsQuery = query(reservationsRef, orderByChild('voiture'), equalTo(vehicleId));
        
        onValue(reservationsQuery, (snapshot) => {
            const reservations = snapshot.val();
            if (reservations) {
                const dates = Object.values(reservations).map(reservation => {
                    return `From: ${new Date(reservation.date_debut).toLocaleDateString()} To: ${new Date(reservation.date_fin).toLocaleDateString()}`;
                }).join('\n');
                Alert.alert('Reserved Dates', dates);
            } else {
                Alert.alert('No Reservations', 'This car has no reservations.');
            }
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>My Cars</Text>
                <ScrollView style={styles.elementPallet} contentContainerStyle={styles.scrollViewContent}>
                    {vehicles.map((vehicle) => (
                        <TouchableOpacity
                            style={styles.element}
                            key={vehicle.id}
                            activeOpacity={0.8}
                            onPress={() => showReservedDates(vehicle.id)}
                        >
                            <View style={styles.infoArea}>
                                <Text style={styles.infoTitle}>{vehicle.make} {vehicle.model}</Text>
                                <Text style={styles.infoSub}>{vehicle.type} - {vehicle.transmission}</Text>
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
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default UserCarsScreen;

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
        height: 100,
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
});
