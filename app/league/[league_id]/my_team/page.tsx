import React from 'react';
import { TextField } from '@mui/material';
import _ from 'lodash';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

import { saveTeamName, saveLineup } from '@/actions/my_team';
import { createClient } from "@/utils/supabase/server";
// import LineupForm from './lineupForm';
import TeamNameForm from './teamNameForm';
const LazyLineupForm = dynamic(() => import('./lineupForm'), {ssr: false});

export default async function MyTeam({params}: { params: {league_id: string}}) {
    const supabase = createClient();

    const {data: { user }} = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const {data: league, error: leagueError } = await supabase.from("league").select("*").eq("id", params.league_id).single();
    if (leagueError) console.error('Error getting league.', leagueError);


    const {data: team, error: teamError} = await supabase.from("team").select("*").eq("league_id", Number(params.league_id)).eq("manager_email", user!.email!).single();
    if (teamError) console.error('Error getting team.', teamError);

    const {data: lineupArr, error: lineupError} = await supabase.rpc('get_team_lineup', {
        the_league_id: Number(params.league_id), 
        team_manager_email: user!.email!
    });
    if (lineupError) console.error('Error getting lineup.', lineupError);
    if (!team) throw new Error('Team not found');
    
    const {data: rounds, error: roundsError } = await supabase.rpc("get_rounds_with_evictions", {the_league_id: Number(params.league_id)});
    const {data: contestants, error: contestantsError} = await supabase.rpc("get_contestants", {the_league_id: Number(params.league_id)});
    const {data: past_submissions, error: pastSubmissionsError} = await supabase.rpc("get_team_submissions", {the_team_id: team.id});
    if (pastSubmissionsError) console.error('Error getting past submissions.', pastSubmissionsError);
    if (!rounds || !contestants || !past_submissions) return <></>;

    const contestantsById = contestants.reduce((acc, c) => {
        acc[c.contestant_id] = c;
        return acc;
    }, {} as {[key: number]: typeof contestants[0]});
    let lineup = lineupArr?.[0]?.contestant_ids.map(i => contestantsById[i]) || [];
    lineup.push(...contestants)
    lineup = lineup.filter(c => {
        const alreadyUsed = !!past_submissions.find(p => p.contestant_id === c.contestant_id)
        const alreadyEvicted = rounds.map(r => r.evicted_contestant).includes(c.contestant_id);
        return !alreadyUsed && !alreadyEvicted;
    });
    lineup = _.uniqBy(lineup, 'contestant_id');

    return <div className='flex flex-col gap-4 md:w-3/4 mx-auto justify-center items-center'>
        <h1 className='text-2xl'>Manage your team</h1>
        <TeamNameForm team={team} saveTeamName={saveTeamName.bind(null, team)} />
        <LazyLineupForm team={team} lineup={lineup} rounds={rounds} contestants={contestants} past_submissions={past_submissions} saveLineup={saveLineup.bind(null, team)} />
    </div>
}