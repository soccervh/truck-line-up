import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import database, {
  FirebaseDatabaseTypes,
} from "@react-native-firebase/database";
import TruckCard from "../components/TruckCard";
import { Truck } from "../types/types";

const MainScreen = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const trucksRef = database().ref("trucks");
    trucksRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const trucksArray = Object.values(data);
        setTrucks(trucksArray as Truck[]);
      }
    });

    return () => trucksRef.off();
  }, []);

  const addTruck = () => {
    Alert.prompt(
      "Add New Truck",
      'Enter truck number and type (e.g., "123 Flatbed")',
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Add",
          onPress: (value) => {
            if (value) {
              const [number, type] = value.split(" ");
              const newTruck: Truck = {
                id: Date.now().toString(),
                number,
                type: type || "Unknown",
                status: "lineup",
                position: trucks.length,
              };
              database().ref(`trucks/${newTruck.id}`).set(newTruck);
            }
          },
        },
      ],
    );
  };

  const handleDragEnd = ({ data }: { data: Truck[] }) => {
    const updates = {};
    data.forEach((truck, index) => {
      updates[`trucks/${truck.id}/position`] = index;
    });
    database().ref().update(updates);
  };

  const toggleTruckStatus = (truck: Truck) => {
    const newStatus = truck.status === "lineup" ? "outOfService" : "lineup";
    database().ref(`trucks/${truck.id}/status`).set(newStatus);
  };

  const filteredTrucks = trucks
    .filter(
      (truck) =>
        truck.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        truck.type.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => a.position - b.position);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search trucks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={addTruck}
        >
          <Text style={styles.addButtonText}>Add Truck</Text>
        </TouchableOpacity>
      </View>

      <DraggableFlatList
        data={filteredTrucks}
        renderItem={({ item, drag }) => (
          <TouchableOpacity
            onLongPress={drag}
            onPress={() => toggleTruckStatus(item)}
          >
            <TruckCard truck={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        onDragEnd={handleDragEnd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MainScreen;
