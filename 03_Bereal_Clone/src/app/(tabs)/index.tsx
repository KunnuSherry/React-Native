import { View,Modal, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export default function Index() {
  const [showPreview, setShowPreview] = useState(false)
  const [previewImage, setPreviewImage] = useState<string|null>(null);
  const [description, setDescription] = useState<string>("");
  const router = useRouter();

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
        setPreviewImage(result.assets[0].uri);
        setShowPreview(true);
        setDescription("")
    }
  };

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
      setPreviewImage(result.assets[0].uri);
      setShowPreview(true);
      setDescription("")

    }
  };

  const showImagePicker = () =>{
    Alert.alert("Select Profile Picture", "Choose from gallery or take a photo", [
        {text: "Cancel", style: "cancel"},
        {text: "Choose from gallery", onPress: pickImage},
        {text: "Take a photo", onPress: takePhoto},
    ]);
}

  return (
    <SafeAreaView 
      style={styles.container} 
      edges={["bottom", "top"]}
    >
      <TouchableOpacity style={styles.fab} onPress={showImagePicker}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={showPreview} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Preview Your Post</Text>
            {previewImage && (
              <Image style={styles.previewImage} source={{ uri: previewImage }} contentFit="cover" />
            )}

            <TextInput
              placeholder="Add a description (optional)"
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={500}
              textAlignVertical="top"
              style={styles.descriptionInput}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={()=>{
                  setShowPreview(false);
                  setPreviewImage(null);
                  setDescription("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.postButton]}>
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position : "absolute",
    bottom : 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {width: 8, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  fabText:{
    color: "#fff",
    fontSize : 32,
    fontWeight: "300",
    lineHeight: 32
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  previewImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  descriptionInput: {
    width: "100%",
    minHeight: 80,
    maxHeight: 120,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    color: "#000",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  postButton: {
    backgroundColor: "#000",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});