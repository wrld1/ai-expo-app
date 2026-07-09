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

export function useProfileForm(onSuccess?: () => void) {
  const { profile, updateProfile } = useProfile();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      age: "25",
      gender: "Інша",
      allergies: [],
      concerns: [],
    },
  });

  useEffect(() => {
    form.reset({
      age: profile.age || "25",
      gender: profile.gender || "Інша",
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
