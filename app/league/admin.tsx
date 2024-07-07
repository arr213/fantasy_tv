import React from 'react';
import { createClient } from "@/utils/supabase/server";
import { Box, Link, Tab, Tabs } from '@mui/material';

export default async function LeagueHomePage({params}: { params: {league_id: string}}) {
    const {league_id} = params;
    const supabase = createClient();

    const {data: league, error: leagueError } = await supabase.from("league").select("*").eq("id", params.league_id).single();
    if (leagueError) {
        console.error('Error getting league.', leagueError);
    }

    const {data: teams, error: teamsError} = await supabase.rpc('get_team_summary', {the_league_id: Number(params.league_id)});
    if (teamsError) {
        console.error('Error getting teams.', teamsError);
    }

    return <div>
        <section className="flex justify-between mb-10">
            <h1 className='text-2xl'>{league?.league_name} Admin</h1>
        </section>

        <section>
            
        </section>
    </div>
}