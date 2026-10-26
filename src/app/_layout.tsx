// app/_layout.tsx

import { Stack } from "expo-router";
import { AppThemeProvider } from "../hooks/use-app-theme";

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen name="detail/[kota]" options={{ title: "Detail Cuaca" }} />

        <Stack.Screen
          name="tambah-favorit"
          options={{
            presentation: "modal",
            title: "Tambah Favorit",
          }}
        />
      </Stack>
    </AppThemeProvider>
  );
}
