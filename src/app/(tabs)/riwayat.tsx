// src/app/(tabs)/riwayat.tsx
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RingkasanKotaTersimpan } from "../../../types/cache";
import { KotaFavorit } from "../../../types/favorit";
import { HasilGeocoding } from "../../../types/geocoding";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import { daftarKotaTersimpan, hapusCache } from "../../services/cacheRepository";
import { ambilRiwayatPencarian } from "../../services/recentSearchStorage";
import { useAppTheme } from "../../hooks/use-app-theme";

export default function TabRiwayat() {
  const { colors } = useAppTheme();
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  const [daftarRiwayat, setDaftarRiwayat] = useState<HasilGeocoding[]>([]);
  const [daftarCache, setDaftarCache] = useState<RingkasanKotaTersimpan[]>([]);

  useFocusEffect(
    useCallback(() => {
      ambilSemuaFavorit().then(setDaftarFavorit);
      ambilRiwayatPencarian().then(setDaftarRiwayat);
      daftarKotaTersimpan().then(setDaftarCache);
    }, []),
  );

  async function hapus(id: number) {
    await hapusFavorit(id);
    setDaftarFavorit((prev) => prev.filter((k) => k.id !== id));
  }

  function konfirmasiHapus(kota: KotaFavorit) {
    Alert.alert("Konfirmasi Hapus", `Yakin hapus ${kota.nama}?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => hapus(kota.id),
      },
    ]);
  }

  function konfirmasiHapusCache(kota: RingkasanKotaTersimpan) {
    Alert.alert(
      "Hapus Cache Kota",
      `Hapus data offline untuk ${kota.nama} dari perangkat?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await hapusCache(kota.kunci);
              setDaftarCache((prev) =>
                prev.filter((item) => item.kunci !== kota.kunci),
              );
            } catch {
              Alert.alert("Gagal Menghapus", "Cache kota belum dapat dihapus.");
            }
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>AKTIVITAS</Text>
        <Text style={[styles.title, { color: colors.text }]}>Riwayat perjalanan</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Akses kembali kota yang pernah kamu jelajahi.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Pencarian terakhir</Text>
        <Text style={{ color: colors.textSecondary }}>{daftarRiwayat.length} pencarian tersimpan</Text>
        {daftarRiwayat.length === 0 && <Text style={{ color: colors.textSecondary }}>Belum ada riwayat pencarian</Text>}
        {daftarRiwayat.map((kota) => (
          <TouchableOpacity
            key={kota.id}
            onPress={() =>
              router.push({
                pathname: "/",
                params: {
                  recentId: String(kota.id), recentName: kota.name,
                  recentLatitude: String(kota.latitude), recentLongitude: String(kota.longitude),
                  recentCountry: kota.country, recentAdmin1: kota.admin1,
                  recentToken: String(Date.now()),
                },
              })
            }
            accessibilityRole="button"
            accessibilityLabel={`Cari cuaca ${kota.name} lagi`}
            style={[styles.card, { backgroundColor: colors.backgroundElement }]}
          >
            <Text style={{ color: colors.text, fontWeight: "700" }}>{kota.name}</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              {[kota.admin1, kota.country].filter(Boolean).join(", ")}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Kota tersimpan offline</Text>
        {daftarCache.length === 0 && <Text style={{ color: colors.textSecondary }}>Belum ada cache kota</Text>}
        {daftarCache.map((kota) => (
          <View key={kota.kunci} style={[styles.card, styles.row, { backgroundColor: colors.backgroundElement }]}>
            <TouchableOpacity
              onPress={() => router.push({ pathname: "/", params: { recentId: String(kota.id), recentName: kota.nama, recentLatitude: String(kota.latitude), recentLongitude: String(kota.longitude), recentToken: String(Date.now()) } })}
              accessibilityRole="button"
              accessibilityLabel={`Buka cache offline ${kota.nama}`}
            >
              <Text style={{ color: colors.text, fontWeight: "700" }}>{kota.nama}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Tersedia tanpa internet</Text>
            </TouchableOpacity>
            <Pressable onPress={() => konfirmasiHapusCache(kota)} style={styles.iconButton}>
              <Text style={{ color: colors.danger, fontWeight: "700" }}>Hapus</Text>
            </Pressable>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Kota favorit</Text>
        <Text style={{ color: colors.textSecondary }}>Tersimpan {daftarFavorit.length} kota</Text>
        {daftarFavorit.length === 0 && <Text style={{ color: colors.textSecondary }}>Belum ada kota favorit</Text>}
        {daftarFavorit.map((kota) => (
          <View key={kota.id} style={[styles.card, styles.row, { backgroundColor: colors.backgroundElement }]}>
            <Text style={{ color: colors.text, fontWeight: "700" }}>{kota.nama}</Text>
            <Pressable onPress={() => konfirmasiHapus(kota)} style={styles.iconButton}>
              <Text style={{ color: colors.danger, fontWeight: "700" }}>Hapus</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 10, paddingBottom: 32 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1.4 },
  title: { fontSize: 30, fontWeight: "800", marginTop: 2 },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "800", marginTop: 14 },
  card: { padding: 15, borderRadius: 16, gap: 4, marginTop: 2 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  iconButton: { padding: 8 },
});
