// src/components/SearchBox.tsx
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";
import { useAppTheme } from "../hooks/use-app-theme";

interface SearchBoxProps {
  onCari: (teks: string) => void;
  teksAwal?: string;
}

export default function SearchBox({ onCari, teksAwal = "" }: SearchBoxProps) {
  const { colors } = useAppTheme();
  const [teks, setTeks] = useState(teksAwal);

  useEffect(() => {
    setTeks(teksAwal);
  }, [teksAwal]);

  function handleChange(nilaiBaru: string) {
    setTeks(nilaiBaru);
    onCari(nilaiBaru); // kirim setiap perubahan, debounce diatur di pemanggilnya
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.backgroundElement,
        borderRadius: 16,
      }}
    >
      <Ionicons name="search" size={20} color={colors.textSecondary} />
      <TextInput
        placeholder="Cari nama kota..."
        value={teks}
        onChangeText={handleChange}
        accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
        placeholderTextColor={colors.textSecondary}
        style={{
          flex: 1,
          color: colors.text,
          paddingVertical: 14,
          fontSize: 15,
        }}
      />
    </View>
  );
}
