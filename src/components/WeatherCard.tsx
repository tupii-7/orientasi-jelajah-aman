// src/components/WeatherCard.tsx
import { Text, View } from "react-native";
import { TingkatAQI, WeatherCardProps } from "../../types/cuaca";
import { spacing, typeScale } from "../constants/styles";
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
      ? `Cuaca ${kota}, suhu ${suhu} derajat, indeks kualitas udara ${indeksAQI}, kategori ${tingkatAQI}`
      : `Cuaca ${kota}, suhu ${suhu} derajat, kualitas udara ${tingkatAQI}`;

  return (
    <View
      accessible
      accessibilityLabel={labelAksesibilitas}
      style={{
        padding: spacing.sedang,
        borderRadius: 8,
        backgroundColor: colors.backgroundElement,
      }}
    >
      <Text style={{ color: colors.text, fontWeight: "bold", fontSize: typeScale.judul }}>
        {kota}
      </Text>
      <Text style={{ color: colors.text, fontSize: 32 }}>{suhu}°C</Text>
      <Text
        style={{ color: warnaPerTingkat[tingkatAQI], fontSize: typeScale.isi }}
      >
        {teksAQI}
      </Text>
    </View>
  );
}
