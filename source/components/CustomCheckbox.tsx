import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../styles/colors";

interface CustomCheckboxProps {
  checked: boolean;
  onPress: () => void;
}

export default function CustomCheckbox({ checked, onPress} : CustomCheckboxProps) {
  return (
    <TouchableOpacity style={styles.checkbox} onPress={onPress}>
      <View style={[styles.checkboxBox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
    </TouchableOpacity>
  ); 
}

const styles = StyleSheet.create({
  checkbox: {
    padding: 4,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});