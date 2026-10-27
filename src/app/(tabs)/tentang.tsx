// app/(tabs)/tentang.tsx

import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../hooks/use-app-theme";

export default function TabTentang() {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, padding: 20, backgroundColor: colors.background }}
    >
      <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "800", letterSpacing: 1.4 }}>
        TENTANG APLIKASI
      </Text>
      <Text
        accessible
        accessibilityLabel="Tentang Jelajah Aman"
        style={{
          fontSize: 30,
          fontWeight: "800",
          color: colors.text,
          marginTop: 4,
        }}
      >
        Jelajah Aman
      </Text>

      <Text style={{ color: colors.textSecondary, marginTop: 4 }}>Versi 1.0.0</Text>
      <View style={{ backgroundColor: colors.primary, borderRadius: 24, padding: 22, marginTop: 28, gap: 10 }}>
        <Ionicons name="compass-outline" size={34} color={colors.onPrimary} />
        <Text style={{ color: colors.onPrimary, fontSize: 20, fontWeight: "800" }}>Jelajah lebih tenang</Text>
        <Text style={{ color: colors.onPrimary, opacity: 0.82, lineHeight: 21 }}>
          Pantau cuaca, kualitas udara, dan lokasi favoritmu dalam satu aplikasi sederhana.
        </Text>
      </View>
      <Text style={{ color: colors.textSecondary, marginTop: 24 }}>Dibuat oleh Fachrii</Text>
    </SafeAreaView>
  );
}
