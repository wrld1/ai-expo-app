import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { colors } from "../../constants/theme";
import { triggerHapticLight } from "../../utils/haptics";
import Divider from "../ui/Divider";
import SettingsRow from "./SettingsRow";

const AGE_VALUES = Array.from({ length: 100 }, (_, i) => String(i + 1));

interface AgePickerProps {
  age: string;
  showPicker: boolean;
  onTogglePicker: () => void;
  onAgeChange: (age: string) => void;
}

export default function AgePicker({ age, showPicker, onTogglePicker, onAgeChange }: AgePickerProps) {
  if (Platform.OS === "ios") {
    return (
      <>
        <SettingsRow
          label="Вік"
          value={`${age} років`}
          onPress={() => {
            triggerHapticLight();
            onTogglePicker();
          }}
        />
        {showPicker && (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={age}
              onValueChange={(val) => {
                triggerHapticLight();
                onAgeChange(val);
              }}
              style={{ color: colors.label }}
            >
              {AGE_VALUES.map((val) => (
                <Picker.Item key={val} label={`${val} років`} value={val} />
              ))}
            </Picker>
          </View>
        )}
      </>
    );
  }

  return (
    <SettingsRow label="Вік">
      <View style={styles.pickerWrapperAndroid}>
        <Picker
          selectedValue={age}
          onValueChange={onAgeChange}
          style={{ color: colors.label, width: 140 }}
          dropdownIconColor={colors.secondaryLabel as string}
          mode="dropdown"
        >
          {AGE_VALUES.map((val) => (
            <Picker.Item key={val} label={`${val} р.`} value={val} color="#1C1C1E" />
          ))}
        </Picker>
      </View>
    </SettingsRow>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    marginTop: -6,
    marginBottom: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  pickerWrapperAndroid: {
    marginRight: -10,
  },
});
