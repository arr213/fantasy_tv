"use client";
import { Button, TextField } from "@mui/material";
import { useState } from "react";


export default function TeamNameForm({ team, saveTeamName }) {
    const [teamName, setTeamName] = useState(team.team_name || '');
    const onChange = (e) => {
        setTeamName(e.target.value);
    }
    return (
        <form action={saveTeamName}>
            <label>Team Name</label>
            <TextField id="team_name" name="team_name" variant="outlined" value={teamName} fullWidth onChange={onChange} />
            {teamName !== team.team_name && <Button type="submit">Save</Button>}
        </form>
    )

}