import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ALLERGY_PRESETS } from "@/constants/profile";
import { colors } from "../../constants/theme";
import Divider from "../ui/Divider";
import ChipsGroup from "./ChipsGroup";
import SettingsRow from "./SettingsRow";

interface AllergiesSectionProps {
  allergies: string[];
  customAllergy: string;
  setCustomAllergy: (val: string) => void;
  onToggle: (val: string) => void;
  onAdd: () => void;
  onRemove: (val: string) => void;
}

export default function AllergiesSection({
  allergies,
  customAllergy,
  setCustomAllergy,
  onToggle,
  onAdd,
  onRemove,
}: AllergiesSectionProps) {
  const customAllergies = allergies.filter((a) => !ALLERGY_PRESETS.includes(a));

  return (
    <>
      <View style={styles.chipsContainerRow}>
        <Text style={[styles.rowSubText, { color: colors.secondaryLabel }]}>
          Оберіть алергени для попередження про ризики страви:
        </Text>
        <ChipsGroup
          presets={ALLERGY_PRESETS}
          selectedValues={allergies}
          onToggle={onToggle}
        />
      </View>

      <Divider />

      <SettingsRow>
        <TextInput
          style={[styles.customInput, { color: colors.label }]}
          value={customAllergy}
          onChangeText={setCustomAllergy}
          placeholder="Додати свій алерген..."
          placeholderTextColor={colors.placeholder}
          onSubmitEditing={onAdd}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.accent }]}
          onPress={onAdd}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#121417" />
        </TouchableOpacity>
      </SettingsRow>

      {customAllergies.length > 0 && (
        <>
          <Divider />
          <View style={styles.chipsContainerRow}>
            <Text style={[styles.rowSubLabel, { color: colors.secondaryLabel }]}>
              Ваші додаткові алергени:
            </Text>
            <View style={styles.chipsRow}>
              {customAllergies.map((allergy) => (
                <View
                  key={allergy}
                  style={[styles.customChip, { borderColor: colors.systemRed }]}
                >
                  <Text style={[styles.customChipText, { color: colors.label }]}>
                    {allergy}
                  </Text>
                  <TouchableOpacity onPress={() => onRemove(allergy)}>
                    <Ionicons
                      name="close-circle"
                      size={16}
                      color={colors.systemRed}
                      style={{ marginLeft: 4 }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  chipsContainerRow: {
    flexDirection: "column",
    alignItems: "stretch",
    paddingVertical: 14,
  },
  rowSubText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  rowSubLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  customInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  addBtn: {
    borderRadius: 8,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  customChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondarySystemGroupedBackground,
    borderRadius: 18,
    borderWidth: 1,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 5,
    margin: 4,
  },
  customChipText: {
    fontSize: 13,
    fontWeight: "500",
  },
});
