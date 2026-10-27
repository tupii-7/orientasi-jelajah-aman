// src/app/tambah-favorit.tsx
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { tambahFavorit } from "../services/favoritStorage";
import { useAppTheme } from "../hooks/use-app-theme";

export default function ModalTambahFavorit() {
  const { colors } = useAppTheme();
  const { id, nama, lat, lon } = useLocalSearchParams<{
    id: string;
    nama: string;
    lat: string;
    lon: string;
  }>();

  async function simpan() {
    await tambahFavorit({
      id: Number(id),
      nama,
      latitude: Number(lat),
      longitude: Number(lon),
    });
    router.back();
  }

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center", backgroundColor: colors.background, gap: 18 }}>
      <View style={{ alignSelf: "center", padding: 18, borderRadius: 22, backgroundColor: colors.primarySoft }}>
        <Ionicons name="heart" size={34} color={colors.primary} />
      </View>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: "800", textAlign: "center" }}>
        Simpan kota favorit?
      </Text>
      <Text style={{ color: colors.textSecondary, textAlign: "center", lineHeight: 21 }}>
        {nama} akan lebih mudah ditemukan dari tab riwayat.
      </Text>
      <Pressable onPress={simpan} style={{ backgroundColor: colors.primary, padding: 15, borderRadius: 14, alignItems: "center", marginTop: 8 }}>
        <Text style={{ color: colors.onPrimary, fontWeight: "800" }}>Simpan ke favorit</Text>
      </Pressable>
      <Pressable onPress={() => router.back()} style={{ padding: 12, alignItems: "center" }}>
        <Text style={{ color: colors.textSecondary, fontWeight: "700" }}>Batal</Text>
      </Pressable>
    </View>
  );
}
