import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { colors } from "../../constants/theme";
import { triggerHapticLight } from "../../utils/haptics";
import SettingsRow from "./SettingsRow";

export interface PickerOption {
  value: string;
  label: string;
}

interface OptionPickerProps {
  label: string;
  value?: string;
  options: readonly PickerOption[];
  placeholder?: string;
  onChange: (value: string) => void;
}

/**
 * Спільний рядок-пікер для полів на кшталт ваги, зросту чи рівня активності.
 * На iOS розкривається під рядком, на Android — нативний dropdown.
 */
export default function OptionPicker({
  label,
  value,
  options,
  placeholder = "Не вказано",
  onChange,
}: OptionPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const selected = options.find((option) => option.value === value);

  if (Platform.OS === "ios") {
    return (
      <>
        <SettingsRow
          label={label}
          value={selected?.label ?? placeholder}
          onPress={() => {
            triggerHapticLight();
            setShowPicker((prev) => !prev);
          }}
        />
        {showPicker && (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={value ?? ""}
              onValueChange={(next) => {
                triggerHapticLight();
                onChange(String(next));
              }}
              style={{ color: colors.label }}
            >
              {!selected && <Picker.Item label={placeholder} value="" />}
              {options.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
        )}
      </>
    );
  }

  return (
    <SettingsRow label={label}>
      <View style={styles.pickerWrapperAndroid}>
        <Picker
          selectedValue={value ?? ""}
          onValueChange={(next) => onChange(String(next))}
          style={{ color: colors.label, width: 200 }}
          dropdownIconColor={colors.secondaryLabel as string}
          mode="dropdown"
        >
          {!selected && (
            <Picker.Item label={placeholder} value="" color="#1C1C1E" />
          )}
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
              color="#1C1C1E"
            />
          ))}
        </Picker>
      </View>
    </SettingsRow>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    marginBottom: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  pickerWrapperAndroid: {
    marginRight: -10,
  },
});
