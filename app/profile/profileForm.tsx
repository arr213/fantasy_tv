"use client";
import { Database } from "@/database.types";
import { Button, TextField } from "@mui/material";
import { first } from "lodash";
import { FormEvent, use, useState } from "react";


export default function ProfileForm({app_user, saveProfile}:  {
    app_user: Database['public']['Tables']['app_user']['Row'], 
    saveProfile: (e: FormData) => void
}) {
    const [firstName, setFirstName] = useState(app_user.first_name || "");
    const [lastName, setLastName] = useState(app_user.last_name || "");

    const onChangeFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.currentTarget.value);
    }
    const onChangeLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.currentTarget.value);
    }

    return (
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
                value={firstName}
                onChange={onChangeFirstName}
                />
            <TextField
                variant="outlined"
                id="last_name"
                name="last_name"
                label="Last Name"
                value={lastName}
                onChange={onChangeLastName}
                />
            <Button 
                type="submit" 
                variant="contained" 
                className="bg-blue-500"
                disabled={firstName === app_user.first_name && lastName === app_user.last_name}
            >Save
            </Button>
        </form>
    );

};