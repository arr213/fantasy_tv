import { Button, TextField } from "@mui/material";
import { createClient } from "@/utils/supabase/server";
import { FormEvent } from 'react'
import {saveProfile} from "@/actions/profile"
import { Database } from '../../database.types'


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
    
    return <div>
        <h1>Profile</h1>
        <form action={saveProfile} className="flex flex-col gap-2">
            <TextField
                variant="outlined"
                disabled
                id="email"
                label="email"
                name="email"
                value={app_user?.email || ""}
                />
            <TextField
                variant="outlined"
                id="first_name"
                name="first_name"
                label="First Name"
                value={app_user?.first_name || ""}
                />
            <TextField
                variant="outlined"
                id="last_name"
                name="last_name"
                label="Last Name"
                value={app_user?.last_name || ""}
                />
            <Button type="submit" variant="contained">Save</Button>
        </form>
    </div>
}