// src/app/(tabs)/pengaturan.tsx
import { useState } from "react";
import { Button, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { hapusSemuaCache } from "../../services/cacheRepository";
import {
  ThemePreference,
  useAppTheme,
} from "../../hooks/use-app-theme";

export default function TabPengaturan() {
  const { colors, preference, setPreference } = useAppTheme();
  const [pesan, setPesan] = useState<string | null>(null);

  async function hapusDataTersimpan() {
    try {
      await hapusSemuaCache();
      setPesan("Data cuaca tersimpan sudah dihapus.");
    } catch {
      setPesan("Data cuaca tersimpan gagal dihapus.");
    }
  }

  async function pilihTema(tema: ThemePreference) {
    try {
      await setPreference(tema);
      setPesan(null);
    } catch {
      setPesan("Preferensi tema gagal disimpan.");
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, padding: 16, gap: 12, backgroundColor: colors.background }}
    >
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: "bold" }}>
        Jelajah Aman
      </Text>
      <Text style={{ color: colors.text }}>Versi 1.0.0</Text>

      <Text style={{ color: colors.text, fontWeight: "bold" }}>
        Mode Tampilan
      </Text>
      <View style={{ gap: 8 }}>
        {(
          [
            ["light", "Terang"],
            ["dark", "Gelap"],
            ["system", "Ikuti Sistem"],
          ] as const
        ).map(([value, label]) => (
          <Pressable
            key={value}
            onPress={() => pilihTema(value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: preference === value }}
            style={{
              padding: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor:
                preference === value ? colors.text : colors.border,
              backgroundColor:
                preference === value
                  ? colors.backgroundSelected
                  : colors.backgroundElement,
            }}
          >
            <Text style={{ color: colors.text }}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <Button title="Hapus Data Cuaca Tersimpan" onPress={hapusDataTersimpan} />

      {pesan && (
        <Text accessibilityLabel={pesan} style={{ color: colors.text }}>
          {pesan}
        </Text>
      )}
    </SafeAreaView>
  );
}
