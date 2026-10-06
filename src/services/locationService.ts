// src/services/locationService.ts
import * as Location from "expo-location";

export type StatusIzinLokasi = "granted" | "denied" | "unavailable";

export interface Koordinat {
  latitude: number;
  longitude: number;
}

/**
 * Memeriksa layanan GPS dan meminta izin akses lokasi foreground pengguna.
 */
export async function mintaIzinLokasi(): Promise<StatusIzinLokasi> {
  try {
    const layananAktif = await Location.hasServicesEnabledAsync();
    if (!layananAktif) {
      return "unavailable";
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted" ? "granted" : "denied";
  } catch (error) {
    console.error("Gagal meminta izin lokasi:", error);
    return "denied";
  }
}

/**
 * Mengambil koordinat latitude dan longitude saat ini.
 */
export async function ambilKoordinatSaatIni(): Promise<Koordinat> {
  try {
    const lokasi = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: lokasi.coords.latitude,
      longitude: lokasi.coords.longitude,
    };
  } catch (error) {
    console.error("Gagal mengambil koordinat:", error);
    throw error;
  }
}
