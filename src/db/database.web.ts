import AsyncStorage from "@react-native-async-storage/async-storage";

interface CacheRow {
  kunci: string;
  kota_id: number;
  nama_kota: string;
  latitude: number;
  longitude: number;
  cuaca_json: string;
  aqi_json: string;
  disimpan_pada: number;
}

const KUNCI_CACHE = "@jelajah_aman:cache-cuaca-web";

async function bacaCache(): Promise<CacheRow[]> {
  const json = await AsyncStorage.getItem(KUNCI_CACHE);
  if (!json) return [];

  try {
    const data: unknown = JSON.parse(json);
    return Array.isArray(data) ? (data as CacheRow[]) : [];
  } catch {
    return [];
  }
}

async function tulisCache(rows: CacheRow[]): Promise<void> {
  await AsyncStorage.setItem(KUNCI_CACHE, JSON.stringify(rows));
}

class WebDatabase {
  async runAsync(sql: string, params: (string | number)[] = []): Promise<void> {
    const rows = await bacaCache();

    if (sql.startsWith("INSERT OR REPLACE")) {
      const [kunci, kotaId, namaKota, latitude, longitude, cuacaJson, aqiJson, disimpanPada] =
        params;
      const filtered = rows.filter((row) => row.kunci !== kunci);
      filtered.push({
        kunci: String(kunci),
        kota_id: Number(kotaId),
        nama_kota: String(namaKota),
        latitude: Number(latitude),
        longitude: Number(longitude),
        cuaca_json: String(cuacaJson),
        aqi_json: String(aqiJson),
        disimpan_pada: Number(disimpanPada),
      });
      await tulisCache(filtered);
      return;
    }

    if (sql.includes("WHERE kunci = ?")) {
      await tulisCache(rows.filter((row) => row.kunci !== String(params[0])));
      return;
    }

    if (sql.includes("disimpan_pada < ?")) {
      await tulisCache(
        rows.filter((row) => row.disimpan_pada >= Number(params[0])),
      );
      return;
    }

    if (sql.includes("DELETE FROM cache_cuaca")) {
      await tulisCache([]);
    }
  }

  async getFirstAsync<T>(
    sql: string,
    params: (string | number)[] = [],
  ): Promise<T | null> {
    const rows = await bacaCache();
    const row = sql.includes("WHERE kunci = ?")
      ? rows.find((item) => item.kunci === String(params[0]))
      : rows[0];
    return (row as T | undefined) ?? null;
  }

  async getAllAsync<T>(): Promise<T[]> {
    const rows = await bacaCache();
    return rows
      .sort((a, b) => b.disimpan_pada - a.disimpan_pada)
      .slice(0, 5) as T[];
  }
}

let dbPromise: Promise<WebDatabase> | null = null;

export function ambilDatabase(): Promise<WebDatabase> {
  if (!dbPromise) dbPromise = Promise.resolve(new WebDatabase());
  return dbPromise;
}
