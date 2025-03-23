import { SessionProvider } from '../utils/ctx';
import { Stack } from "expo-router/stack";

export default function Root() {
  return (
    <SessionProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SessionProvider>
  );
}