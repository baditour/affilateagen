import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FirebaseProvider } from "./context/FirebaseContext";
import "../global.css";

export default function RootLayout() {
  return (
    <FirebaseProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#f8fafc" },
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar style="auto" />
    </FirebaseProvider>
  );
}
