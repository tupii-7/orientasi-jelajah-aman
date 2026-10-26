import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { View, useColorScheme } from "react-native";
import { Colors } from "../constants/theme";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface AppThemeValue {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  colors: (typeof Colors)[ResolvedTheme];
  setPreference: (preference: ThemePreference) => Promise<void>;
}

const KUNCI_TEMA = "@jelajah_aman:tema";
const AppThemeContext = createContext<AppThemeValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  useEffect(() => {
    AsyncStorage.getItem(KUNCI_TEMA)
      .then((value) => {
        if (value === "light" || value === "dark" || value === "system") {
          setPreferenceState(value);
        }
      })
      .catch(() => {});
  }, []);

  const resolvedTheme: ResolvedTheme =
    preference === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : preference;

  const value = useMemo<AppThemeValue>(
    () => ({
      preference,
      resolvedTheme,
      colors: Colors[resolvedTheme],
      setPreference: async (nextPreference) => {
        await AsyncStorage.setItem(KUNCI_TEMA, nextPreference);
        setPreferenceState(nextPreference);
      },
    }),
    [preference, resolvedTheme],
  );

  return (
    <AppThemeContext.Provider value={value}>
      <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
      <View style={{ flex: 1, backgroundColor: value.colors.background }}>
        {children}
      </View>
    </AppThemeContext.Provider>
  );
}

export function useAppTheme(): AppThemeValue {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error("useAppTheme harus digunakan di dalam AppThemeProvider");
  }
  return context;
}
