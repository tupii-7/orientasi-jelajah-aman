// src/app/(tabs)/pengaturan.tsx
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>PREFERENSI</Text>
        <Text style={[styles.title, { color: colors.text }]}>Pengaturan</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Sesuaikan pengalaman Jelajah Aman sesuai kebutuhanmu.
        </Text>

        <View style={[styles.section, { backgroundColor: colors.backgroundElement }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Mode tampilan</Text>
          <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>Pilih tampilan yang nyaman untuk digunakan.</Text>
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
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
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
            <Ionicons name={value === "light" ? "sunny-outline" : value === "dark" ? "moon-outline" : "contrast-outline"} size={20} color={colors.primary} />
            <Text style={{ color: colors.text, fontWeight: "700" }}>{label}</Text>
            {preference === value && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
          </Pressable>
        ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.backgroundElement }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Penyimpanan</Text>
          <Text style={{ color: colors.textSecondary, marginBottom: 10 }}>
            Hapus cache cuaca lokal jika ingin mengosongkan ruang.
          </Text>
          <Pressable onPress={hapusDataTersimpan} style={[styles.dangerButton, { borderColor: colors.danger }]}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
            <Text style={{ color: colors.danger, fontWeight: "700" }}>Hapus data cuaca tersimpan</Text>
          </Pressable>
        </View>

      {pesan && (
        <Text accessibilityLabel={pesan} style={{ color: colors.text }}>
          {pesan}
        </Text>
      )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 12, paddingBottom: 32 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1.4 },
  title: { fontSize: 30, fontWeight: "800" },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 10 },
  section: { padding: 16, borderRadius: 20, gap: 4 },
  sectionTitle: { fontSize: 17, fontWeight: "800" },
  dangerButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 13, borderWidth: 1, borderRadius: 14 },
});
