import ProfileDetails from "@/components/profile/ProfileDetails";
import ProfileForm from "@/components/profile/ProfileForm";
import Button from "@/components/ui/Button";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { colors } from "../../constants/theme";
import { useProfile } from "../../context/ProfileContext";
import { useProfileForm } from "../../hooks/useProfileForm";

export default function ProfileScreen() {
  const { profile } = useProfile();
  const [isEditing, setIsEditing] = useState(
    () => !profile.age || !profile.gender,
  );

  const { form, isSaving, onSubmit } = useProfileForm(() =>
    setIsEditing(false),
  );
  const { control } = form;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        styles.container,
        { backgroundColor: colors.systemGroupedBackground },
      ]}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
      >
        {!isEditing ? (
          <>
            <ProfileDetails profile={profile} />
            <Button
              title="Редагувати профіль"
              variant="default"
              onPress={() => setIsEditing(true)}
            />
          </>
        ) : (
          <ProfileForm
            control={control}
            isSaving={isSaving}
            onSubmit={onSubmit}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
});
