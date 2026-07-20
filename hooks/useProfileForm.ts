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
  // Потрібні для добової норми калорій, але не блокують збереження профілю.
  weightKg: z.string().optional(),
  heightCm: z.string().optional(),
  activityLevel: z
    .enum(["sedentary", "light", "moderate", "active", "very_active"])
    .optional(),
  allergies: z.array(z.string()),
  concerns: z.array(z.string()),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileForm(onSuccess?: () => void) {
  const { profile, updateProfile } = useProfile();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      age: "25",
      gender: "Інша",
      weightKg: undefined,
      heightCm: undefined,
      activityLevel: undefined,
      allergies: [],
      concerns: [],
    },
  });

  useEffect(() => {
    form.reset({
      age: profile.age || "25",
      gender: profile.gender || "Інша",
      weightKg: profile.weightKg,
      heightCm: profile.heightCm,
      activityLevel: profile.activityLevel,
      allergies: profile.allergies || [],
      concerns: profile.concerns || [],
    });
  }, [profile, form]);

  const handleSave = async (data: ProfileFormData) => {
    setIsSaving(true);
    triggerHapticSuccess();
    try {
      await updateProfile(data);
      Alert.alert("Успіх", "Профіль успішно збережено!");
      if (onSuccess) onSuccess();
    } catch {
      triggerHapticError();
      Alert.alert("Помилка", "Не вдалося зберегти профіль");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    isSaving,
    onSubmit: form.handleSubmit(handleSave),
  };
}
