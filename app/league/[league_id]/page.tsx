import React from 'react';
import { createClient } from "@/utils/supabase/server";
import { AppBar, Box, Button, Link, Tab, Tabs, Toolbar, Typography } from '@mui/material';

export default async function LeagueHomePage({params}: { params: {league_id: string}}) {
    const {league_id} = params;
    const supabase = createClient();

    const {data: league, error: leagueError } = await supabase.from("league").select("*").eq("id", params.league_id).single();
    if (leagueError) console.error('Error getting league.', leagueError);

    const {data: teams, error: teamsError} = await supabase.rpc('get_team_summary', {the_league_id: Number(params.league_id)});
    if (teamsError) console.error('Error getting teams.', teamsError);

    // console.log("Teams", teams);

    return <div>

        <header className="flex flex-col justify-between my-5">
            <h1 className='text-2xl'>Welcome to {league?.league_name}!</h1>
            <p className='text-sm'>If you haven't yet, please be sure to check out the <Link href={`/league/${league_id}/rules`}>rules of the league</Link>, and be sure to <Link href={`/league/${league_id}/my_team`}>set your lineup.</Link></p>
        </header>

        <section className="bg-slate-300 p-10 rounded-lg">
            <h1 className='text-2xl mb-5'>League Standings</h1>
            <div className='grid grid-cols-2 gap-3'>
                <h2>Team</h2>
                <h2>Manager</h2>
                {/* <h1>Remaining Players</h1> */}
            {teams?.flatMap((t, i) => {
                return <>
                    <h3 key={`team_name_${i}`}>{t.team_name}</h3>
                    <h3 key={`manager_${i}`}>{t.team_manager_first_name} {t.team_manager_last_name}</h3>
                </>
            })}
            </div>
        </section>
    </div>
}