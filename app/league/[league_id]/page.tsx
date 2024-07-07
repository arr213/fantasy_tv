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
    // console.log("Teams", teams);

    return <div>
        <section className="flex justify-between mb-10">

        <h1 className='text-2xl'>{league?.league_name}</h1>
        </section>

        <section>
            <h1 className='text-xl'>League Standings</h1>
            <div className='grid grid-cols-2 gap-3'>
                <h2>Team</h2>
                <h2>Manager</h2>
                {/* <h1>Remaining Players</h1> */}
            {teams?.map(t => {
                return <>
                    <h3>{t.team_name}</h3>
                    <h3>{t.team_manager_first_name} {t.team_manager_last_name}</h3>
                </>
            })}
            </div>
        </section>
    </div>
}