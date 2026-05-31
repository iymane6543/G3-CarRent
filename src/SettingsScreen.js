import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, Alert, Platform, ScrollView } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { database, storage } from './firebase';
import { ref, push } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { SessionContext } from './SessionContext';
import  { useContext } from 'react';


const AddCarScreen = ({ navigation }) => {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [type, setType] = useState('');
    const [transmission, setTransmission] = useState('');
    const [pricePerDay, setPricePerDay] = useState('');
    const [description, setDescription] = useState('');
    const [motorPowerHp, setMotorPowerHp] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [engineCapacityCc, setEngineCapacityCc] = useState('');
    const [traction, setTraction] = useState('');
    const [image, setImage] = useState(null);
    const { user } = useContext(SessionContext);
    

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const handleAddCar = async () => {
        let imageUrl = './assets/noimage.png';

        if (image) {
            try {
                const response = await fetch(image);
                const blob = await response.blob();
                const fileName = image.split('/').pop();
                const imageRef = storageRef(storage, `images/${fileName}`);

                await uploadBytes(imageRef, blob);
                imageUrl = await getDownloadURL(imageRef);
                console.log('Image uploaded successfully:', imageUrl);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }

        const newCar = {
            added_by: user.email,
            make,
            model,
            type,
            transmission,
            price_per_day: parseFloat(pricePerDay),
            description,
            image: imageUrl,
            properties: {
                motor_power_hp: parseFloat(motorPowerHp),
                fuel_type: fuelType,
                engine_capacity_cc: parseFloat(engineCapacityCc),
                traction: traction
            }
        };

        try {
            const carListRef = ref(database, 'cars');
            await push(carListRef, newCar);
            console.log('New Car Added:', newCar);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error adding car:', error);
            Alert.alert('Error', 'There was an error adding the car.');
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Make"
                    value={make}
                    onChangeText={setMake}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Model"
                    value={model}
                    onChangeText={setModel}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Type"
                    value={type}
                    onChangeText={setType}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Transmission"
                    value={transmission}
                    onChangeText={setTransmission}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Price Per Day"
                    keyboardType="numeric"
                    value={pricePerDay}
                    onChangeText={setPricePerDay}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Motor Power (hp)"
                    keyboardType="numeric"
                    value={motorPowerHp}
                    onChangeText={setMotorPowerHp}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Fuel Type"
                    value={fuelType}
                    onChangeText={setFuelType}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Engine Capacity (cc)"
                    keyboardType="numeric"
                    value={engineCapacityCc}
                    onChangeText={setEngineCapacityCc}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Traction"
                    value={traction}
                    onChangeText={setTraction}
                />
                <Button title="Add Car" onPress={handleAddCar} />
                <TouchableOpacity onPress={pickImage}>
                    <Text style={styles.uploadButton}>Pick an image from camera roll</Text>
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={styles.image} />}
            </View>
        </ScrollView>
    );
};

export default AddCarScreen;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    uploadButton: {
        color: 'blue',
        textAlign: 'center',
        marginBottom: 12,
    },
    image: {
        width: 100, // Smaller width
        height: 100, // Smaller height
        marginBottom: 12,
        alignSelf: 'center',
    },
});
