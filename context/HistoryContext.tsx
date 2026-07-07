import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Ingredient {
  name: string;
  weight: string;
}

export interface ScanResult {
  foodName: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  ingredients: Ingredient[];
  whatIsGood: string;
  risks: string;
  summary: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  imageUri: string;
  result: ScanResult;
  correctionHistory?: Array<{ userPrompt: string; result: ScanResult }>;
}

interface HistoryContextType {
  history: HistoryItem[];
  isLoading: boolean;
  addHistoryItem: (imageUri: string, result: ScanResult) => Promise<HistoryItem>;
  updateHistoryItemResult: (id: string, newResult: ScanResult, correctionText: string) => Promise<void>;
  deleteHistoryItem: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const HISTORY_STORAGE_KEY = "@food_scanner_history";

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    } finally {
      setIsLoading(false);
    }
  };

  const addHistoryItem = async (imageUri: string, result: ScanResult) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      imageUri,
      result,
      correctionHistory: [],
    };
    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to save history item", e);
    }
    return newItem;
  };

  const updateHistoryItemResult = async (id: string, newResult: ScanResult, correctionText: string) => {
    const updatedHistory = history.map((item) => {
      if (item.id === id) {
        const correctionHistory = item.correctionHistory || [];
        return {
          ...item,
          result: newResult,
          correctionHistory: [...correctionHistory, { userPrompt: correctionText, result: newResult }],
        };
      }
      return item;
    });
    setHistory(updatedHistory);
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to update history item", e);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to delete history item", e);
    }
  };

  const clearHistory = async () => {
    setHistory([]);
    try {
      await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear history", e);
    }
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        isLoading,
        addHistoryItem,
        updateHistoryItemResult,
        deleteHistoryItem,
        clearHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
};
