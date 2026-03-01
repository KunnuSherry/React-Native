import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  const router = useRouter();
  let isAuth = false;
  useEffect(() => {
    if(!isAuth){
      router.replace("/(auth)/login");
    }
    else{
      router.replace("/(tabs)/about");
    }
  });
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: "red" },
          headerTintColor: "white",
          animation: "slide_from_right",
        }}
      >
          <Stack.Screen name="(tabs)"/>
          <Stack.Screen name="(auth)"/>
      </Stack>
    </AuthProvider>
  );
}