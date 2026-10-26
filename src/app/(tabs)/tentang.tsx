// app/(tabs)/tentang.tsx

import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../hooks/use-app-theme";

export default function TabTentang() {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, padding: 16, backgroundColor: colors.background }}
    >
      <Text
        accessible
        accessibilityLabel="Tentang Jelajah Aman"
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: colors.text,
        }}
      >
        Jelajah Aman
      </Text>

      <Text style={{ color: colors.text }}>Versi 1.0.0</Text>

      <Text style={{ color: colors.text }}>Pembuat: Fachrii</Text>
    </SafeAreaView>
  );
}
