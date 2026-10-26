import AsyncStorage from "@react-native-async-storage/async-storage";
import { HasilGeocoding } from "../../types/geocoding";

const KUNCI_PENYIMPANAN = "@jelajah_aman:riwayat-pencarian";
const MAKSIMAL_RIWAYAT = 10;

export async function ambilRiwayatPencarian(): Promise<HasilGeocoding[]> {
  const json = await AsyncStorage.getItem(KUNCI_PENYIMPANAN);
  return json ? JSON.parse(json) : [];
}

export async function simpanRiwayatPencarian(
  kota: HasilGeocoding,
): Promise<void> {
  const daftarLama = await ambilRiwayatPencarian();
  const daftarTanpaDuplikat = daftarLama.filter((item) => item.id !== kota.id);
  const daftarBaru = [kota, ...daftarTanpaDuplikat].slice(0, MAKSIMAL_RIWAYAT);

  await AsyncStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(daftarBaru));
}
