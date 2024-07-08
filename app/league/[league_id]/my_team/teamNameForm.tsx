"use client";
import { Database } from "@/database.types";
import { Button, TextField } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";


export default function TeamNameForm({ 
    team, 
    saveTeamName 
}: {
    team: Database['public']['Tables']['team']['Row'],
    saveTeamName: (fd: FormData) => void
}) {
    const [teamName, setTeamName] = useState(team.team_name || '');
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTeamName(e.currentTarget.value);
    }
    return (
        <form action={saveTeamName}>
            <label>Team Name</label>
            <TextField id="team_name" name="team_name" variant="outlined" value={teamName} fullWidth onChange={onChange} />
            {teamName !== team.team_name && <Button type="submit">Save</Button>}
        </form>
    )

}