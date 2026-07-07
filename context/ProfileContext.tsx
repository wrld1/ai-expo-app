import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface ProfileData {
  age: string;
  gender: string;
  allergies: string[];
  concerns: string[];
  geminiApiKey: string;
}

interface ProfileContextType {
  profile: ProfileData;
  isLoading: boolean;
  updateProfile: (updates: Partial<ProfileData>) => Promise<void>;
  getEffectiveApiKey: () => string;
}

const defaultProfile: ProfileData = {
  age: "",
  gender: "",
  allergies: [],
  concerns: [],
  geminiApiKey: "",
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const PROFILE_STORAGE_KEY = "@food_scanner_profile";

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load profile", e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<ProfileData>) => {
    try {
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      await AsyncStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(updatedProfile),
      );
    } catch (e) {
      console.error("Failed to save profile", e);
      throw e;
    }
  };

  const getEffectiveApiKey = () => {
    if (profile.geminiApiKey && profile.geminiApiKey.trim() !== "") {
      return profile.geminiApiKey.trim();
    }
    return process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
  };

  return (
    <ProfileContext.Provider
      value={{ profile, isLoading, updateProfile, getEffectiveApiKey }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
