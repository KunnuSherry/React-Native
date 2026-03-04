import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import {AuthProvider, useAuth} from "@/context/AuthContext"

function RouteGuard(){
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const segments = useSegments();

  const isAuth = segments[0] === "(auth)";
  const isTabs = segments[0] === "(tabs)";

  useEffect(()=>{
    if (isLoading) return;
    if(!user){
      if(!isAuth){
        router.replace("/(auth)/login")
      }      
    }
    else{
      if(!isTabs){
        router.replace("/(tabs)")
      }      
    }
  }, [user, segments, router, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
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
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard/>
    </AuthProvider>
  );
}