// src/app/(tabs)/index.tsx
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AtribusiCuaca from "../../components/AtribusiCuaca";
import SearchBox from "../../components/SearchBox";
import StatusData from "../../components/StatusData";
import WeatherCard from "../../components/WeatherCard";

import { labelKodeCuaca } from "../../constants/weatherCode";
import { useDebounce } from "../../hooks/use-debounce";
import {
  bersihkanCacheLama,
  daftarKotaTersimpan,
  hapusCache,
} from "../../services/cacheRepository";
import {
  ambilCuacaOfflineFirst,
  BATAS_CACHE_MS,
} from "../../services/cuacaRepository";
import { cariKota } from "../../services/geocodingService";
import {
  ambilKoordinatSaatIni,
  mintaIzinLokasi,
} from "../../services/locationService";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import { simpanRiwayatPencarian } from "../../services/recentSearchStorage";
import { useAppTheme } from "../../hooks/use-app-theme";

import {
  HasilCuacaOffline,
  RingkasanKotaTersimpan,
} from "../../../types/cache";
import { HasilGeocoding } from "../../../types/geocoding";

export default function HalamanUtama() {
  const { colors } = useAppTheme();
  const {
    recentId,
    recentName,
    recentLatitude,
    recentLongitude,
    recentCountry,
    recentAdmin1,
    recentToken,
  } = useLocalSearchParams<{
    recentId?: string;
    recentName?: string;
    recentLatitude?: string;
    recentLongitude?: string;
    recentCountry?: string;
    recentAdmin1?: string;
    recentToken?: string;
  }>();
  const [teksCari, setTeksCari] = useState("");
  const [hasilPencarian, setHasilPencarian] = useState<HasilGeocoding[]>([]);
  const [kotaTerpilih, setKotaTerpilih] = useState<HasilGeocoding | null>(null);
  const [hasil, setHasil] = useState<HasilCuacaOffline | null>(null);
  const [kotaTersimpan, setKotaTersimpan] = useState<RingkasanKotaTersimpan[]>(
    [],
  );
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);

  const teksTertunda = useDebounce(teksCari, 500);
  const requestIdRef = useRef(0); // pencegah race condition

  useEffect(() => {
    if (!recentId || !recentName || !recentLatitude || !recentLongitude) {
      return;
    }

    const latitude = Number(recentLatitude);
    const longitude = Number(recentLongitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

    setTeksCari(recentName);
    pilihKota(
      {
        id: Number(recentId),
        name: recentName,
        latitude,
        longitude,
        country: recentCountry ?? "",
        admin1: recentAdmin1,
      },
      false,
      false,
    );
  }, [
    recentAdmin1,
    recentCountry,
    recentId,
    recentLatitude,
    recentLongitude,
    recentName,
    recentToken,
  ]);

  async function muatKotaTersimpan() {
    setKotaTersimpan(await daftarKotaTersimpan());
  }

  function konfirmasiHapusCache(kunci: string, nama: string) {
    Alert.alert(
      "Hapus Cache Kota",
      `Hapus data offline untuk ${nama} dari perangkat?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await hapusCache(kunci);
              setKotaTersimpan((prev) =>
                prev.filter((kota) => kota.kunci !== kunci),
              );
            } catch {
              Alert.alert("Gagal Menghapus", "Cache kota belum dapat dihapus.");
            }
          },
        },
      ],
    );
  }

  // Saat aplikasi dibuka: buang cache > 7 hari, lalu tampilkan daftar tersimpan
  useEffect(() => {
    bersihkanCacheLama(BATAS_CACHE_MS)
      .then(muatKotaTersimpan)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (teksTertunda.trim().length === 0) {
      setHasilPencarian([]);
      return;
    }
    cariKota(teksTertunda)
      .then(setHasilPencarian)
      .catch(() => setHasilPencarian([]));
  }, [teksTertunda]);

  async function pilihKota(
    kota: HasilGeocoding,
    paksaPerbarui = false,
    catatRiwayat = true,
  ) {
    setKotaTerpilih(kota);
    if (catatRiwayat) {
      await simpanRiwayatPencarian(kota);
    }
    const idSaatIni = ++requestIdRef.current;
    setSedangMemuat(true);
    setPesanError(null);

    try {
      const data = await ambilCuacaOfflineFirst(
        {
          id: kota.id,
          nama: kota.name,
          latitude: kota.latitude,
          longitude: kota.longitude,
        },
        { paksaPerbarui },
      );

      if (idSaatIni !== requestIdRef.current) return; // hasil basi, abaikan
      setHasil(data);
      muatKotaTersimpan();
    } catch (err) {
      if (idSaatIni !== requestIdRef.current) return;
      setHasil(null);
      setPesanError(
        "Belum ada data tersimpan dan tidak ada koneksi internet. Sambungkan internet lalu coba lagi.",
      );
    } finally {
      if (idSaatIni === requestIdRef.current) setSedangMemuat(false);
    }
  }

  async function gunakanLokasiSaatIni() {
    const status = await mintaIzinLokasi();
    if (status === "denied") {
      setPesanLokasi(
        "Izin lokasi ditolak. Silakan cari kota secara manual di atas.",
      );
      return;
    }
    if (status === "unavailable") {
      setPesanLokasi(
        "Layanan lokasi tidak aktif di perangkat ini. Silakan cari kota secara manual.",
      );
      return;
    }

    setPesanLokasi(null);
    const koordinat = await ambilKoordinatSaatIni();
    pilihKota(
      {
        id: -1,
        name: "Lokasi Saat Ini",
        latitude: koordinat.latitude,
        longitude: koordinat.longitude,
        country: "",
      },
      false,
      false,
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>SELAMAT DATANG</Text>
            <Text style={[styles.heading, { color: colors.text }]}>Jelajah Aman</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Pantau cuaca dan kualitas udara di sekitarmu.
            </Text>
          </View>
          <View style={[styles.heroIcon, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="compass" size={26} color={colors.primary} />
          </View>
        </View>

        <SearchBox onCari={setTeksCari} teksAwal={teksCari} />
        <TouchableOpacity
          accessibilityRole="button"
          onPress={gunakanLokasiSaatIni}
          style={[styles.locationButton, { backgroundColor: colors.primarySoft }]}
        >
          <Ionicons name="navigate" size={18} color={colors.primary} />
          <Text style={{ color: colors.primary, fontWeight: "700" }}>Gunakan lokasi saat ini</Text>
          <Ionicons name="arrow-forward" size={17} color={colors.primary} />
        </TouchableOpacity>

        {pesanLokasi && (
          <Text accessibilityLabel={pesanLokasi} style={{ color: colors.text }}>
            {pesanLokasi}
          </Text>
        )}

        {hasilPencarian.map((kota) => (
          <TouchableOpacity
            key={kota.id}
            onPress={() => pilihKota(kota)}
            style={[styles.searchResult, { backgroundColor: colors.backgroundElement }]}
          >
            <Ionicons name="location-outline" size={20} color={colors.primary} />
            <View>
              <Text style={{ color: colors.text, fontWeight: "600" }}>{kota.name}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                {[kota.admin1, kota.country].filter(Boolean).join(", ")}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {kotaTersimpan.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeading}>
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 17 }}>
                Lokasi tersimpan
              </Text>
              <Ionicons name="bookmark" size={18} color={colors.primary} />
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
              Tetap bisa dibuka saat offline
            </Text>
            {kotaTersimpan.map((k) => (
              <View
                key={k.kunci}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    pilihKota(
                      {
                        id: k.id,
                        name: k.nama,
                        latitude: k.latitude,
                        longitude: k.longitude,
                        country: "",
                      },
                      false,
                      false,
                    )
                  }
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
                    <Text style={{ color: colors.text, fontWeight: "600" }}>{k.nama}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityLabel={`Hapus cache ${k.nama}`}
                  onPress={() => konfirmasiHapusCache(k.kunci, k.nama)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={17} color={colors.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {sedangMemuat && <ActivityIndicator />}

        {pesanError && (
          <View style={[styles.messageCard, { backgroundColor: colors.backgroundElement }]}>
            <Text accessibilityLabel={pesanError} style={{ color: colors.text }}>
              {pesanError}
            </Text>
            <TouchableOpacity
              onPress={() => kotaTerpilih && pilihKota(kotaTerpilih, true)}
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            >
              <Text style={{ color: colors.onPrimary, fontWeight: "700" }}>Coba lagi</Text>
            </TouchableOpacity>
          </View>
        )}

        {hasil && kotaTerpilih && !sedangMemuat && (
          <>
            <StatusData
              sumber={hasil.sumber}
              disimpanPada={hasil.disimpanPada}
            />
            <WeatherCard
              kota={kotaTerpilih.name}
              suhu={hasil.cuaca.saatIni.suhu}
              tingkatAQI={konversiTingkatAQI(hasil.kualitasUdara.indeksAQI)}
            />
            <Text style={{ fontSize: 12, color: colors.textSecondary }}>
              Kondisi: {labelKodeCuaca(hasil.cuaca.saatIni.kodeCuaca)}{" "}
              {"\u2022"} Angin {hasil.cuaca.saatIni.kecepatanAngin} km/j
            </Text>
            <TouchableOpacity
              onPress={() => pilihKota(kotaTerpilih, true, false)}
              style={[styles.outlineButton, { borderColor: colors.border }]}
            >
              <Ionicons name="refresh" size={17} color={colors.primary} />
              <Text style={{ color: colors.text, fontWeight: "700" }}>Perbarui sekarang</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/tambah-favorit",
                  params: {
                    id: String(kotaTerpilih.id),
                    nama: kotaTerpilih.name,
                    lat: String(kotaTerpilih.latitude),
                    lon: String(kotaTerpilih.longitude),
                  },
                })
              }
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="heart-outline" size={17} color={colors.onPrimary} />
              <Text style={{ color: colors.onPrimary, fontWeight: "700" }}>Tambahkan ke favorit</Text>
            </TouchableOpacity>
          </>
        )}

        <AtribusiCuaca />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16, paddingBottom: 32 },
  hero: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1.4 },
  heading: { fontSize: 30, fontWeight: "800", marginTop: 5 },
  subtitle: { fontSize: 14, marginTop: 5, maxWidth: 280, lineHeight: 20 },
  heroIcon: { width: 54, height: 54, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  locationButton: { flexDirection: "row", alignItems: "center", gap: 9, padding: 14, borderRadius: 14 },
  searchResult: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14 },
  section: { gap: 4, paddingTop: 4 },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  deleteButton: { padding: 8 },
  messageCard: { gap: 14, padding: 16, borderRadius: 16 },
  primaryButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 14 },
  outlineButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 13, borderRadius: 14, borderWidth: 1 },
});
