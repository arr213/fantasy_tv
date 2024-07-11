import { Button, TextField } from "@mui/material";
import { createClient } from "@/utils/supabase/server";
import { FormEvent } from 'react'
import {saveProfile} from "@/actions/profile"
import { Database } from '../../database.types'
import ProfileForm from "./profileForm";


export default async function Index() {
    const supabase = createClient();

    const {
        data: { user },
      } = await supabase.auth.getUser();

    if (!user) {
        console.log("User", user)
        return "Error";
    }
    const {
        data: app_user,
      } = await supabase.from("app_user")
        .select("*")
        .eq("email", user.email!)
        .single();
        
    if (!app_user) throw new Error("No app_user found");
    
    return <div>
        <h1>Profile</h1>
        <ProfileForm app_user={app_user} saveProfile={saveProfile} />
    </div>
}