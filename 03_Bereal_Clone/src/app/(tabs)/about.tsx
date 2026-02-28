import { Text, View, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { Image } from "expo-image"; 
import { Link } from "expo-router";

export default function About() {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://i0.wp.com/www.dogwonder.co.uk/wp-content/uploads/2009/12/tumblr_ku2pvuJkJG1qz9qooo1_r1_400.gif?resize=320%2C320",
        }}
        style={{ width: 200, height: 200 }}
      />
      <TextInput placeholder="Email"/>
      <Link href={"/"}> Go to Home </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
