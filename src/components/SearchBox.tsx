// src/components/SearchBox.tsx
import { useEffect, useState } from "react";
import { TextInput, View } from "react-native";

interface SearchBoxProps {
  onCari: (teks: string) => void;
  teksAwal?: string;
}

export default function SearchBox({ onCari, teksAwal = "" }: SearchBoxProps) {
  const [teks, setTeks] = useState(teksAwal);

  useEffect(() => {
    setTeks(teksAwal);
  }, [teksAwal]);

  function handleChange(nilaiBaru: string) {
    setTeks(nilaiBaru);
    onCari(nilaiBaru); // kirim setiap perubahan, debounce diatur di pemanggilnya
  }

  return (
    <View>
      <TextInput
        placeholder="Cari nama kota..."
        value={teks}
        onChangeText={handleChange}
        accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
        style={{ borderWidth: 1, padding: 8, borderRadius: 8 }}
      />
    </View>
  );
}
