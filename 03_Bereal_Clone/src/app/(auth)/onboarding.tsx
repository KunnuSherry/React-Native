import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {useRouter} from "expo-router"
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { uploadProfileImage } from "@/lib/supabase/storage";
import { supabase } from "@/lib/supabase/client";

export default function OnboardingScreen() {
    const router = useRouter();
    const {user, updateUser} = useAuth();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [image, setImage] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);


    const takePhoto = async () =>{
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Denied", "We need camera permission to access your photos");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setImage(result.assets[0].uri);
        }
    }
    const showImagePicker = () =>{
        Alert.alert("Select Profile Picture", "Choose from gallery or take a photo", [
            {text: "Cancel", style: "cancel"},
            {text: "Choose from gallery", onPress: pickImage},
            {text: "Take a photo", onPress: takePhoto},
        ]);
    }
    const handleComplete = async () => {
        if (!name || !username || !image) {
            Alert.alert("Please fill in all fields");
            return;
        }

        if (!user) {
            Alert.alert("Error", "User not found. Please sign in again.");
            return;
        }

        setIsLoading(true);
        try {
            // Check if username is already taken (excluding current user)
            const { data: existingUser, error: usernameError } = await supabase
                .from("Profiles")
                .select("id")
                .eq("username", username)
                .neq("id", user.id)
                .maybeSingle();

            if (usernameError) {
                console.error("Error checking username availability", usernameError);
                throw usernameError;
            }

            if (existingUser) {
                Alert.alert("Username already taken");
                return;
            }

            let profileImageUrl: string | undefined;

            // Upload profile picture to Supabase Storage
            if (image) {
                try {
                    profileImageUrl = await uploadProfileImage(user.id, image);
                } catch (error) {
                    console.error("Error uploading profile picture", error);
                    Alert.alert("Error", "Failed to upload profile picture");
                    return;
                }
            }

            // Update user profile in Supabase
            await updateUser({
                name,
                username,
                profileImage: profileImageUrl,
                onboardingCompleted: true,
            });

            router.replace("/(tabs)");
        } catch (error) {
            Alert.alert("Error", "Failed to complete onboarding");
            console.error("Error completing onboarding", error);
        } finally {
            setIsLoading(false);
        }
    }
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Denied", "We need permission to access your photos");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
            {/* header and form all centered within container */}
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Complete your profile</Text>
                    <Text style={styles.subTitle}>Let's get you started</Text>
                </View>

                <View style={styles.form}>
                    <TouchableOpacity style={styles.imageContainer} onPress={showImagePicker}>
                        {image ? (
                            <Image
                                source={{ uri: image }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <View style={styles.placeholderImage}>
                                <Text style={styles.placeholderImageText}>+</Text>
                            </View>
                        )}
                        <View style={styles.editBadge}>
                            <Text style={styles.editBadgeText}>Edit</Text>
                        </View>
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor="#999"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="#999"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        autoComplete="username"
                    />

                    <TouchableOpacity style={styles.button} onPress={handleComplete}>
                        {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
                    </TouchableOpacity>

                </View>
            </View>
        </SafeAreaView>
  );
}   

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    content:{
        width: "100%",
        alignItems: "center",
    },
    header:{
        marginBottom: 32,
        alignItems: "center",
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
        width: "100%",
        alignItems: "center"
    },
    imageContainer:{
        marginBottom: 24,
        position: "relative",
    },
    placeholderImage:{
        width: 120,
        height: 120,
        position: "relative",
        backgroundColor: "#f5f5f5",
        borderRadius: 60,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#e0e0e0",
        borderStyle: "dashed",
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    placeholderImageText:{
        fontSize: 48,
        color: "#666",
    },
    editBadge:{
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#000",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16

    },
    editBadgeText:{
        color: "#fff",
        fontSize: 12,
        fontWeight: "600"
    },
    input:{
        width: "100%",
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    button:{
        width: "100%",
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