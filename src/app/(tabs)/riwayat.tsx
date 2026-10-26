// src/app/(tabs)/riwayat.tsx
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Button, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RingkasanKotaTersimpan } from "../../../types/cache";
import { KotaFavorit } from "../../../types/favorit";
import { HasilGeocoding } from "../../../types/geocoding";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import { daftarKotaTersimpan, hapusCache } from "../../services/cacheRepository";
import { ambilRiwayatPencarian } from "../../services/recentSearchStorage";

export default function TabRiwayat() {
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
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
        Riwayat Pencarian
      </Text>

      <Text style={{ color: "#666" }}>
        {daftarRiwayat.length} pencarian terakhir
      </Text>

      {daftarRiwayat.length === 0 && (
        <Text>Belum ada riwayat pencarian</Text>
      )}
      {daftarRiwayat.map((kota) => (
        <TouchableOpacity
          key={kota.id}
          onPress={() =>
            router.push({
              pathname: "/",
              params: {
                recentId: String(kota.id),
                recentName: kota.name,
                recentLatitude: String(kota.latitude),
                recentLongitude: String(kota.longitude),
                recentCountry: kota.country,
                recentAdmin1: kota.admin1,
                recentToken: String(Date.now()),
              },
            })
          }
          accessibilityRole="button"
          accessibilityLabel={`Cari cuaca ${kota.name} lagi`}
        >
          <Text>{kota.name}</Text>
        </TouchableOpacity>
      ))}

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 12 }}>
        Kota Tersimpan Offline
      </Text>

      {daftarCache.length === 0 && <Text>Belum ada cache kota</Text>}
      {daftarCache.map((kota) => (
        <View
          key={kota.kunci}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/",
                params: {
                  recentId: String(kota.id),
                  recentName: kota.nama,
                  recentLatitude: String(kota.latitude),
                  recentLongitude: String(kota.longitude),
                  recentToken: String(Date.now()),
                },
              })
            }
            accessibilityRole="button"
            accessibilityLabel={`Buka cache offline ${kota.nama}`}
          >
            <Text>{kota.nama}</Text>
          </TouchableOpacity>
          <Button
            title="Hapus Cache"
            color="red"
            onPress={() => konfirmasiHapusCache(kota)}
          />
        </View>
      ))}

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 12 }}>
        Kota Favorit
      </Text>

      <Text style={{ color: "#666" }}>
        Tersimpan {daftarFavorit.length} kota
      </Text>

      {daftarFavorit.length === 0 && <Text>Belum ada kota favorit</Text>}
      {daftarFavorit.map((kota) => (
        <View
          key={kota.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>{kota.nama}</Text>
          <Button
            title="Hapus"
            color="red"
            onPress={() => konfirmasiHapus(kota)}
          />
        </View>
      ))}
    </SafeAreaView>
  );
}
