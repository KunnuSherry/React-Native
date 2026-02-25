import { Text, View, StyleSheet, TextInput, ActivityIndicator, Button } from "react-native";
import { Image } from "expo-image"; 
import { Link, useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.hellowWorldTitle}>Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  hellowWorldTitle: {
    color : "red",
  }
});
