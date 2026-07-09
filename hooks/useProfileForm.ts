import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import * as z from "zod";
import { useProfile } from "../context/ProfileContext";
import {
  triggerHapticError,
  triggerHapticLight,
  triggerHapticSuccess,
} from "../utils/haptics";

export const profileSchema = z.object({
  age: z.string().min(1, "Вік обов'язковий"),
  gender: z.string(),
  allergies: z.array(z.string()),
  concerns: z.array(z.string()),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileForm() {
  const { profile, updateProfile } = useProfile();
  const [showAgePicker, setShowAgePicker] = useState(false);
  const [customAllergy, setCustomAllergy] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { handleSubmit, setValue, watch, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      age: "25",
      gender: "Інша",
      allergies: [],
      concerns: [],
    },
  });

  useEffect(() => {
    reset({
      age: profile.age || "25",
      gender: profile.gender || "Інша",
      allergies: profile.allergies || [],
      concerns: profile.concerns || [],
    });
  }, [profile, reset]);

  const age = watch("age");
  const gender = watch("gender");
  const allergies = watch("allergies") || [];
  const concerns = watch("concerns") || [];

  const setAge = (val: string) => setValue("age", val, { shouldDirty: true });
  const setGender = (val: string) => setValue("gender", val, { shouldDirty: true });

  const toggleAllergy = (allergy: string) => {
    triggerHapticLight();
    const updated = allergies.includes(allergy)
      ? allergies.filter((a) => a !== allergy)
      : [...allergies, allergy];
    setValue("allergies", updated, { shouldDirty: true });
  };

  const addCustomAllergy = () => {
    const trimmed = customAllergy.trim();
    if (trimmed && !allergies.includes(trimmed)) {
      triggerHapticLight();
      setValue("allergies", [...allergies, trimmed], { shouldDirty: true });
      setCustomAllergy("");
    }
  };

  const removeAllergy = (allergy: string) => {
    triggerHapticLight();
    setValue("allergies", allergies.filter((a) => a !== allergy), { shouldDirty: true });
  };

  const toggleConcern = (concern: string) => {
    triggerHapticLight();
    const updated = concerns.includes(concern)
      ? concerns.filter((c) => c !== concern)
      : [...concerns, concern];
    setValue("concerns", updated, { shouldDirty: true });
  };

  const handleSave = async (data: ProfileFormData) => {
    setIsSaving(true);
    triggerHapticSuccess();
    try {
      await updateProfile(data);
      Alert.alert("Успіх", "Профіль успішно збережено!");
    } catch {
      triggerHapticError();
      Alert.alert("Помилка", "Не вдалося зберегти профіль");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    age,
    gender,
    allergies,
    concerns,
    customAllergy,
    setCustomAllergy,
    showAgePicker,
    toggleAgePicker: () => setShowAgePicker((v) => !v),
    isSaving,
    setAge,
    setGender,
    toggleAllergy,
    addCustomAllergy,
    removeAllergy,
    toggleConcern,
    onSubmit: handleSubmit(handleSave),
  };
}
