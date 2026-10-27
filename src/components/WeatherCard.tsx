// src/components/WeatherCard.tsx
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { TingkatAQI, WeatherCardProps } from "../../types/cuaca";
import { typeScale } from "../constants/styles";
import { useAppTheme } from "../hooks/use-app-theme";

const warnaPerTingkat: Record<TingkatAQI, string> = {
  BAIK: "green",
  SEDANG: "goldenrod",
  TIDAK_SEHAT: "orange",
  BERBAHAYA: "crimson",
};

export default function WeatherCard({
  kota,
  suhu,
  kelembapan,
  kondisi,
  angin,
  tingkatAQI,
  indeksAQI,
}: WeatherCardProps) {
  const { colors } = useAppTheme();
  const teksAQI =
    indeksAQI !== undefined
      ? `AQI: ${indeksAQI} (${tingkatAQI})`
      : `AQI: ${tingkatAQI}`;

  const labelAksesibilitas =
    indeksAQI !== undefined
      ? `Cuaca ${kota}, suhu ${suhu} derajat, kelembapan ${kelembapan ?? "tidak tersedia"} persen, indeks kualitas udara ${indeksAQI}, kategori ${tingkatAQI}`
      : `Cuaca ${kota}, suhu ${suhu} derajat, kelembapan ${kelembapan ?? "tidak tersedia"} persen, kualitas udara ${tingkatAQI}`;

  return (
    <View
      accessible
      accessibilityLabel={labelAksesibilitas}
      style={{ padding: 22, borderRadius: 24, backgroundColor: colors.primary }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View>
          <Text style={{ color: colors.onPrimary, fontSize: 13, opacity: 0.8 }}>
            CUACA SAAT INI
          </Text>
          <Text style={{ color: colors.onPrimary, fontWeight: "700", fontSize: typeScale.judul, marginTop: 4 }}>
            {kota}
          </Text>
        </View>
        <Ionicons name="partly-sunny" size={42} color={colors.onPrimary} />
      </View>
      <Text style={{ color: colors.onPrimary, fontSize: 52, fontWeight: "800", marginTop: 18 }}>
        {suhu}°
      </Text>
      <Text style={{ color: colors.onPrimary, opacity: 0.82, fontSize: typeScale.isi, marginTop: 2 }}>
        {kondisi ?? "Kondisi cuaca saat ini"}
      </Text>
      <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
        {kelembapan !== undefined && (
          <View style={{ flex: 1, padding: 12, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.16)" }}>
            <Ionicons name="water-outline" size={18} color={colors.onPrimary} />
            <Text style={{ color: colors.onPrimary, fontSize: 17, fontWeight: "800", marginTop: 8 }}>
              {kelembapan}%
            </Text>
            <Text style={{ color: colors.onPrimary, opacity: 0.75, fontSize: 11 }}>Kelembapan</Text>
          </View>
        )}
        {angin !== undefined && (
          <View style={{ flex: 1, padding: 12, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.16)" }}>
            <Ionicons name="navigate-outline" size={18} color={colors.onPrimary} />
            <Text style={{ color: colors.onPrimary, fontSize: 17, fontWeight: "800", marginTop: 8 }}>
              {angin}
            </Text>
            <Text style={{ color: colors.onPrimary, opacity: 0.75, fontSize: 11 }}>km/j angin</Text>
          </View>
        )}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginTop: 14 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: warnaPerTingkat[tingkatAQI] }} />
        <Text style={{ color: colors.onPrimary, fontSize: typeScale.isi }}>{teksAQI}</Text>
      </View>
    </View>
  );
}
