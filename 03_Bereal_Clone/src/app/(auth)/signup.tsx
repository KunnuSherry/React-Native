import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {useRouter} from "expo-router"
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SignUpScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {signUp} = useAuth();


    const handleSignUp = async () =>{
        if(!email || !password){
            Alert.alert("Please fill in all fields");
            return;
        }
        if(password.length < 6){
            Alert.alert("Password must be at least 6 characters");
            return;
        }
        setIsLoading(true);
        try{
            await signUp(email, password);
            router.push("/(auth)/onboarding");
        }catch(error){
            console.error("Error signing up", error);
            Alert.alert("Error", "Failed to sign up");
        }finally{
            setIsLoading(false);
        }
    }
    return (
        <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Create an Account</Text>
                <Text style={styles.subTitle}>Sign Up to Get Started</Text>
                <View style={styles.form}>
                    <TextInput 
                    placeholder="Email" 
                    placeholderTextColor="gray"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    onChangeText={setEmail}
                    value={email}
                    style={styles.input}
                    />
                    <TextInput 
                    placeholder="Password" 
                    placeholderTextColor="gray"
                    autoCapitalize="none"
                    autoComplete="password"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    value={password}
                    style={styles.input}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                        {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkbutton} onPress={()=>{router.push("/(auth)/login")}}>
                        <Text style={styles.linkButtonText}>
                            Already have an account? <Text>Sign In</Text>
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