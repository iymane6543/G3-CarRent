import React, { useEffect, useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert, Platform, ScrollView } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { database, storage } from './firebase';
import { ref, push } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { SessionContext } from './SessionContext';

const AddCarScreen = ({ navigation }) => {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [type, setType] = useState('SUV');
    const [transmission, setTransmission] = useState('Manual');
    const [pricePerDay, setPricePerDay] = useState('');
    const [description, setDescription] = useState('');
    const [motorPowerHp, setMotorPowerHp] = useState('');
    const [fuelType, setFuelType] = useState('Petrol');
    const [engineCapacityCc, setEngineCapacityCc] = useState('');
    const [traction, setTraction] = useState('');
    const [image, setImage] = useState(null);
    const { user } = useContext(SessionContext);

    // Options pour les sélecteurs
    const typeOptions = ['SUV', 'Sedan', 'MPV', 'Hatchback'];
    const transmissionOptions = ['Manual', 'Automatic'];
    const fuelOptions = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

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
        if (!make || !model || !pricePerDay) {
            Alert.alert('Error', 'Please fill in all required fields (Make, Model, Price Per Day).');
            return;
        }

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
            added_by: user?.email || 'unknown',
            make,
            model,
            type,
            transmission,
            price_per_day: parseFloat(pricePerDay),
            description,
            image: imageUrl,
            properties: {
                motor_power_hp: parseFloat(motorPowerHp) || 0,
                fuel_type: fuelType,
                engine_capacity_cc: parseFloat(engineCapacityCc) || 0,
                traction: traction
            }
        };

        try {
            const carListRef = ref(database, 'cars');
            await push(carListRef, newCar);
            console.log('New Car Added:', newCar);
            Alert.alert('Success', 'Car added successfully!');
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

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Add New Car</Text>

                {/* Basic Info */}
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

                {/* Type - Sélecteur visuel */}
                <Text style={styles.label}>Type</Text>
                <View style={styles.optionsRow}>
                    {typeOptions.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[styles.optionButton, type === option && styles.optionButtonActive]}
                            onPress={() => setType(option)}
                        >
                            <Text style={[styles.optionText, type === option && styles.optionTextActive]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Transmission - Sélecteur visuel */}
                <Text style={styles.label}>Transmission</Text>
                <View style={styles.optionsRow}>
                    {transmissionOptions.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[styles.optionButton, transmission === option && styles.optionButtonActive]}
                            onPress={() => setTransmission(option)}
                        >
                            <Text style={[styles.optionText, transmission === option && styles.optionTextActive]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Price Per Day ($)"
                    keyboardType="numeric"
                    value={pricePerDay}
                    onChangeText={setPricePerDay}
                />
                
                {/* Description - champ texte normal */}
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Description (ex: Beautiful car, well maintained...)"
                    multiline
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                />

                {/* Properties */}
                <Text style={styles.sectionTitle}>Properties</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Motor Power (hp)"
                    keyboardType="numeric"
                    value={motorPowerHp}
                    onChangeText={setMotorPowerHp}
                />

                {/* Fuel Type - Sélecteur visuel */}
                <Text style={styles.label}>Fuel Type</Text>
                <View style={styles.optionsRow}>
                    {fuelOptions.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[styles.optionButton, fuelType === option && styles.optionButtonActive]}
                            onPress={() => setFuelType(option)}
                        >
                            <Text style={[styles.optionText, fuelType === option && styles.optionTextActive]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Engine Capacity (cc)"
                    keyboardType="numeric"
                    value={engineCapacityCc}
                    onChangeText={setEngineCapacityCc}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Traction (FWD, RWD, AWD)"
                    value={traction}
                    onChangeText={setTraction}
                />

                {/* Image Picker */}
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                    <Text style={styles.uploadButton}>Pick an image from camera roll</Text>
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={styles.image} />}

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleAddCar}>
                    <Text style={styles.submitButtonText}>ADD CAR</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default AddCarScreen;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 15,
    },
    optionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 10,
        marginBottom: 8,
    },
    optionButtonActive: {
        backgroundColor: '#007AFF',
    },
    optionText: {
        fontSize: 14,
        color: '#333',
    },
    optionTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 15,
        color: '#333',
    },
    imagePicker: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
    },
    uploadButton: {
        color: '#007AFF',
        fontSize: 14,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginBottom: 12,
        alignSelf: 'center',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});