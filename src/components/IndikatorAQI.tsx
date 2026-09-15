import { Text } from "react-native";
import { LaporanUdara } from "../../types/cuaca";

interface IndikatorAQIProps {
  laporan: LaporanUdara;
}

export default function IndikatorAQI({ laporan }: IndikatorAQIProps) {
  let warna = "green";

  if (laporan.tingkat === "SEDANG") {
    warna = "orange";
  } else if (laporan.tingkat === "TIDAK_SEHAT") {
    warna = "red";
  } else if (laporan.tingkat === "BERBAHAYA") {
    warna = "purple";
  }

  return (
    <Text style={{ color: warna }}>Kualitas Udara: {laporan.tingkat}</Text>
  );
}
