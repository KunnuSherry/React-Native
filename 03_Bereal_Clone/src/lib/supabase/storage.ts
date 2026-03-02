import { supabase } from "./client";
import { File } from "expo-file-system";

// Upload a profile image from a local URI (Expo / React Native)
export const uploadProfileImage = async (userId: string, imageUri: string) => {
  try {
    const cleanUri = imageUri.split("?")[0];
    const fileExtension = cleanUri.split(".").pop() || "jpg";
    const fileName = `${userId}/profile.${fileExtension}`;

    // Use the new Expo FileSystem File API to read as ArrayBuffer
    const file = new File(imageUri);
    const arrayBuffer = await file.arrayBuffer();

    const { error } = await supabase.storage
      .from("profiles")
      .upload(fileName, arrayBuffer, {
        contentType: `image/${fileExtension}`,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data: uriData } = supabase.storage
      .from("profiles")
      .getPublicUrl(fileName);

    return uriData.publicUrl;
  } catch (error) {
    throw error;
  }
};