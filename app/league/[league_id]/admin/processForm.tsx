"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@mui/material";
import { redirect } from "next/navigation";
import { processSurvivalSubmissions } from "@/actions/survival_admin";

export default function ProcessSurvivalForm({league_id}: {league_id: number}) {

  const onClick = processSurvivalSubmissions.bind(null, league_id);

  return (
        <form action={onClick}>
            <Button 
                variant="outlined"
                type="submit"
            >
                Process Now
            </Button>
        </form>
  );
}