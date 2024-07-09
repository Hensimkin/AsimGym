import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Modal, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EquipmentCard from '../components/EquipmentCard'; // Adjust the import path as necessary
import { Icon } from 'react-native-elements';
import { equipmentData } from '../data/equipmentData'; // Import the equipment data

const EquipmentPage = () => {
    const navigation = useNavigation();
    const [filter, setFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);

    const applyFilter = (type) => {
        setFilter(type);
        setModalVisible(false);
    };

    const filteredData = equipmentData.filter(equipment => 
        (!filter || equipment.title.toLowerCase().includes(filter.toLowerCase())) &&
        equipment.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCardPress = (equipment) => {
        setSelectedEquipment(equipment);
        setDetailsModalVisible(true);
    };

    const closeDetailsModal = () => {
        setDetailsModalVisible(false);
        setSelectedEquipment(null);
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={styles.searchFilterContainer}>
                        <TextInput
                            style={styles.searchBar}
                            placeholder="Search equipment..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filterButton}>
                            <Icon name="filter-list" type="material" color="#fff" />
                            <Text style={styles.filterButtonText}>Filter</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <TouchableOpacity onPress={() => applyFilter(null)}>
                                        <Text style={styles.modalOption}>All</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => applyFilter('assisted')}>
                                        <Text style={styles.modalOption}>Assisted</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => applyFilter('band')}>
                                        <Text style={styles.modalOption}>Band</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => applyFilter('barbell')}>
                                        <Text style={styles.modalOption}>Barbell</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => applyFilter('body weight')}>
                                        <Text style={styles.modalOption}>Body Weight</Text>
                                    </TouchableOpacity>
                                    {/* Add more filters as needed */}
                                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        {filteredData && filteredData.map((equipment, index) => (
                            <TouchableOpacity key={index} onPress={() => handleCardPress(equipment)}>
                                <EquipmentCard
                                    title={equipment.title}
                                    description={equipment.description}
                                    image={equipment.image}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {selectedEquipment && (
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={detailsModalVisible}
                            onRequestClose={closeDetailsModal}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.exerciseTitle}>{selectedEquipment.title}</Text>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.modalText}>Description: {selectedEquipment.description}</Text>
                                    </View>
                                    <Image source={selectedEquipment.image } style={styles.exerciseImage} />
                                    <TouchableOpacity onPress={closeDetailsModal} style={styles.closeButton}>
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingTop: 10, // Ensure items start from the top
    },
    searchFilterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchBar: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
    },
    filterButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    textContainer: {
        alignItems: 'flex-start',
        width: '100%',
        marginBottom: 10,
    },
    modalOption: {
        fontSize: 18,
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
    },
    closeButtonText: {
        color: 'red',
        fontSize: 16,
    },
    exerciseTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 5,
    },
    exerciseImage: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
});

export default EquipmentPage;
