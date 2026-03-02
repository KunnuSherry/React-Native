import { createContext, useContext } from "react";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";

export interface User {
    id : string;
    name: string;
    email: string;
    username: string;
    profileImage?: string;
    onboardingCompleted?: boolean;
}

interface AuthContextType {
    user: User | null;
    signUp: (email: string, password: string) => Promise<void>;
    updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: React.ReactNode}) =>{
    const [user, setUser] = useState<User | null>(null);
    const fetchUserProfile = async(userId : string): Promise<User | null> =>{
        try{
            const {data, error} = await supabase.from("Profiles").select("*").eq("id", userId).single();
            if(error){
                console.error("Error fetching user profile", error);
                return null;
            }
            if(!data){
                console.error("User profile not found");
                return null;
            }
            const authUser = await supabase.auth.getUser();
            if(!authUser.data.user){
                console.error("User not found");
                return null;
            }
            return {
                id: data.id,
                name: data.name,
                username: data.username,
                email: authUser.data.user.email || "",
                profileImage: data.profile_image_url,
                onboardingCompleted: data.onboarding_completed,
            }
        }catch(error){
            console.error("Error fetching user profile", error);
            throw error;
        }
    }
    const signIn = async(email: string, password: string) =>{
        
    }
    const signUp = async(email: string, password: string) =>{
        const {data, error} = await supabase.auth.signUp({
            email,
            password,
        });
        if(error){
            throw error;
        }
        if(data.user){
            console.log("User signed up successfully", data.user);
            const userProfile = await fetchUserProfile(data.user.id);
            if(userProfile){
                setUser(userProfile);
            }
        }
    }
    const updateUser = async(userData: Partial<User>) =>{
        if(!user) return;
        try{
            const updateData: any = {};
            if (userData.name !== undefined) updateData.name = userData.name;
            if (userData.username !== undefined)
            updateData.username = userData.username;
            if (userData.profileImage !== undefined)
            updateData.profile_image_url = userData.profileImage;
            if (userData.onboardingCompleted !== undefined)
            updateData.onboarding_completed = userData.onboardingCompleted;
            
            const{error} = await supabase.from("Profiles").update(updateData).eq("id", user.id);
            if(error){
                throw error;
            }
        }catch(error){
            console.error("Error updating user", error);
            throw error;
        }
    };
    return <AuthContext.Provider value={{user, signUp, updateUser}}>{children}</AuthContext.Provider>;
};

export const useAuth = () =>{
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
export default AuthContext;