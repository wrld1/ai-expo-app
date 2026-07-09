import ProfileDetails from "@/components/profile/ProfileDetails";
import ProfileForm from "@/components/profile/ProfileForm";
import Button from "@/components/ui/Button";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { colors } from "../../constants/theme";
import { useProfile } from "../../context/ProfileContext";
import { useProfileForm } from "../../hooks/useProfileForm";

export default function ProfileScreen() {
  const { profile, isLoading } = useProfile();
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setIsEditing(!profile.age || !profile.gender);
    }
  }, [isLoading]);

  const { form, isSaving, onSubmit } = useProfileForm(() =>
    setIsEditing(false),
  );
  const { control } = form;

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.systemGroupedBackground, justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

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
