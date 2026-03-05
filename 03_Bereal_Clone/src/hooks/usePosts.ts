import { useAuth } from "@/context/AuthContext";
import { uploadPostImage } from "@/lib/supabase/storage";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export interface PostUser{
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}

export interface Post{
  id: string;
  user_id: string;
  image_url: string;
  description: string;
  expired_at: string;
  created_at: string;
  is_active: boolean;
  profiles?:PostUser;
}

export const usePosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    loadPosts();

  },[]);

  const loadPosts = async() =>{
    if(!user) return;

    setIsLoading(true);
    try {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(`*, 
          Profiles(id, name, username, profile_image_url)`)
        .eq("is_active", true)
        .gt("expired_at", new Date().toISOString())
        .order("expired_at", { ascending: false });
      if(postsError){
        console.error(postsError);
        throw postsError;
      }

      if(!postsData || postsData.length===0){
        setPosts([]);
        return;
      }

      const postsWithProfiles = postsData.map((post)=>({
        ...post,
        profiles: post.profiles || null,
      }));

      setPosts(postsWithProfiles);
    } catch (error) {
      console.error(error);
      throw error
    } finally{
      setIsLoading(false)
    }
  }

  const createPost = async (imageUri: string, description?: string): Promise<void> => {
    if (!user) {
      throw new Error("User Not Authenticated");
    }

    try {
      const imageUrl = await uploadPostImage(user.id, imageUri);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const { error } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          description: description || null,
          expired_at: expiresAt.toISOString(),
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating post", error);
        throw error;
      }
    } catch (error) {
      console.error("Error in createPost", error);
      throw error;
    }
  };

  return { createPost, posts };
};