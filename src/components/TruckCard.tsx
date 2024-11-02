import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Truck } from "../types/types";

interface TruckCardProps {
  truck: Truck;
  onPress?: () => void;
}

const TruckCard = ({ truck, onPress }: TruckCardProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.card,
          truck.status === "outOfService" && styles.outOfService,
        ]}
      >
        <Text style={styles.number}>#{truck.number}</Text>
        <Text style={styles.type}>{truck.type}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  outOfService: {
    backgroundColor: "#ffebee",
  },
  number: {
    fontSize: 18,
    fontWeight: "bold",
  },
  type: {
    fontSize: 14,
    color: "#666",
  },
});

export default TruckCard;
