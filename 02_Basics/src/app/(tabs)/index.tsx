import { View, StyleSheet } from "react-native";
import { Host, Button } from "@expo/ui/jetpack-compose";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Host style={{ width: 200, height: 60 }}>
        <Button
          variant="elevated"
          onPress={() => router.push("/profile")}
        >
          Click Me
        </Button>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});