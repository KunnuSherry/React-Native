import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router"

export default function Login() {
    const router = useRouter();
    return (
        <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subTitle}>Sign in to your Account</Text>
                <View style={styles.form}>
                    <TextInput 
                    placeholder="Email" 
                    placeholderTextColor="gray"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    style={styles.input}
                    />
                    <TextInput 
                    placeholder="Password" 
                    placeholderTextColor="gray"
                    autoCapitalize="none"
                    autoComplete="password"
                    secureTextEntry={true}
                    style={styles.input}
                    />

                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Sign in</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkbutton} onPress={()=>{router.push("/(auth)/signup")}}>
                        <Text style={styles.linkButtonText}>
                            Don't have an account? <Text>Sign up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
      </View>
    </SafeAreaView>
  );
}   

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content:{
        flex: 1,
        justifyContent: "center",
        padding: 24,
    },
    title:{
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 8,
    },
    subTitle:{
        fontSize: 16,
        marginBottom: 32,
        color: "#666"
    },
    form:{
        width: "100%"
    },
    input:{
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    button:{
        backgroundColor: "#000",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    buttonText:{
        color: "#fff",
        fontSize: 16,
        fontWeight: "600"
    },
    linkbutton:{
        marginTop: 24,
        alignItems: "center"
    },
    linkButtonText:{
        color: "#666",
        fontSize : 14,
    },
    linkButtonTextBold:{
        fontWeight: "600",
        color: "#000"
    }


});