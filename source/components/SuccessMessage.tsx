import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SuccessMessageProps {
  message: string;
}

export default function SuccessMessage({ message } : SuccessMessageProps) {
  return (
    <View style={styles.successMessage}>
      <Text style={styles.successText}>✓ {message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  successMessage: {
    backgroundColor: '#d1fae5',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20, 
    alignItems: 'center',
  },
  successText: {
    color: '#065f46',
    fontSize: 16,
    fontWeight: '500',
  },
});