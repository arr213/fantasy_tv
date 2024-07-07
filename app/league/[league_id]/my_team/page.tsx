import React from 'react';
import { createClient } from "@/utils/supabase/server";

export default async function MyTeam({params}: { params: {league_id: string}}) {
    const supabase = createClient();

    const {data: league, error: leagueError } = await supabase.from("league").select("*").eq("id", params.league_id).single();
    if (leagueError) {
        console.error('Error getting league.', leagueError);
    }

    const {data: teams, error: teamsError} = await supabase.rpc('get_team_summary', {the_league_id: Number(params.league_id)});
    if (teamsError) {
        console.error('Error getting teams.', teamsError);
    }
    console.log("Teams", teams);

    return <div>
        <h1 className='text-2xl'>{league?.league_name}</h1>
        League {params.league_id}
    </div>
}