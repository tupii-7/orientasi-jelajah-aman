// app/(tabs)/tentang.tsx

import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabTentang() {
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text
        accessible
        accessibilityLabel="Tentang Jelajah Aman"
        style={{
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        Jelajah Aman
      </Text>

      <Text>Versi 1.0.0</Text>

      <Text>Pembuat: Fachrii</Text>
    </SafeAreaView>
  );
}
