// src/app/detail/[kota].tsx
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import WeatherCard from "../../components/WeatherCard";
import { useAppTheme } from "../../hooks/use-app-theme";

export default function HalamanDetail() {
  const { kota } = useLocalSearchParams<{ kota: string }>();
  const { colors } = useAppTheme();

  return (
    <View style={{ flex: 1, padding: 20, gap: 16, backgroundColor: colors.background }}>
      <WeatherCard kota={kota} suhu={29} kondisi="Data contoh" tingkatAQI="BAIK" />
      <Pressable
        onPress={() => router.push("/tambah-favorit")}
        style={{ backgroundColor: colors.primary, padding: 15, borderRadius: 14, alignItems: "center" }}
      >
        <Text style={{ color: colors.onPrimary, fontWeight: "800" }}>Tambahkan ke favorit</Text>
      </Pressable>
    </View>
  );
}
