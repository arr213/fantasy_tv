import React from 'react';
import { createClient } from "@/utils/supabase/server";
import { AppBar, Box, Button, Link, Tab, Tabs, Toolbar, Typography } from '@mui/material';

export default async function LeagueHomePage({params}: { params: {league_id: string}}) {
    const {league_id} = params;
    const supabase = createClient();

    const {data: league, error: leagueError } = await supabase.from("league").select("*").eq("id", params.league_id).single();
    if (leagueError) console.error('Error getting league.', leagueError);

    const {data: rounds, error: roundsError } = await supabase.rpc("get_rounds_with_evictions", {the_league_id: Number(params.league_id)});
    if (!rounds || roundsError) {
      console.error('Error getting rounds.', roundsError);
    }
    if (!rounds) return (
        <div>
            <header className="flex flex-col justify-between my-5">
                <h1 className='text-2xl'>Welcome to {league?.league_name}!</h1>
                <p className='text-sm'>If you haven't yet, please be sure to check out the <Link href={`/league/${league_id}/rules`}>rules of the league</Link>, and be sure to <Link href={`/league/${league_id}/my_team`}>set your lineup.</Link></p>
            </header>
        </div>
    );

    const {data: teams, error: teamsError} = await supabase
        .from('team')
        .select('id, team_name, app_user(first_name, last_name)')
        .eq('league_id', Number(league_id))
    if (!teams || teamsError) console.error('Error getting teams.', teamsError);

    const {data: contestants, error: contestantsError} = await supabase.rpc('get_contestants', {the_league_id: Number(league_id)});
    if (contestantsError || !contestants) console.error('Error getting contestants.', contestantsError);
    if (!contestants) return <></>;

    const {data: survivalRecords, error: survivalRecordsError} = await supabase
        .from('survival_record')
        .select('*')
        .eq('league_id', Number(league_id))
        .order('round_number', {ascending: true});
    if (survivalRecordsError || !survivalRecords) console.error('Error getting survival records.', survivalRecordsError);
    const contestantMap = contestants.reduce((acc, c) => {
        acc[c.contestant_id] = c;
        return acc;
    }, {} as Record<number, typeof contestants[0]>)
    const roundMap = rounds.reduce((acc, r) => {
        acc[r.round_number] = r;
        return acc;
    }, {} as Record<number, typeof rounds[0]>);
    const enhancedSurvivalRecords = survivalRecords?.map(sr => {
        const round = rounds.find(r => r.round_id === sr.round_id);
        const contestant = sr.contestant_id ? contestantMap[sr.contestant_id] : null;
        const evicted_contestant = round?.evicted_contestant ? contestantMap[round.evicted_contestant] : null;
        const isMistake = contestant === evicted_contestant;
        const isCorrect = evicted_contestant && contestant?.contestant_id !== evicted_contestant.contestant_id;
        return {...sr, isMistake, isCorrect, round, contestant, evicted_contestant};
    }) || [];
    console.log("Null Check:", null === null);

    const enhancedTeams = teams?.map(t => {
        const records = enhancedSurvivalRecords.filter(sr => sr.team_id === t.id);
        const bench = contestants.filter(c => {
            return !(
                records.map(tr => tr.contestant_id).includes(c.contestant_id)
                || records.map(tr => tr.evicted_contestant?.contestant_id).includes(c.contestant_id)
            );
        });
        
        const roundsSurvived = records.filter(tr => tr.isCorrect).length;
        const mistakeCount = records.filter(tr => tr.isMistake).length;
        const isStillInGame = !mistakeCount;
        const sortString = `${mistakeCount.toString().padStart(3, '0')}${roundsSurvived.toString().padStart(3, '0')}`;
        return {...t, records, bench, roundsSurvived, mistakeCount, isStillInGame, sortString};
    }).sort((a, b) => {
        if (a.sortString < b.sortString) return -1;
        if (a.sortString > b.sortString) return 1;
        return 0;
    })

    return (
        <div className='p-4'>
            <header className="flex flex-col justify-between my-5">
                <h1 className='text-2xl'>Welcome to {league?.league_name}!</h1>
                <p className='text-sm'>If you haven't yet, please be sure to check out the <Link href={`/league/${league_id}/rules`}>rules of the league</Link>, and be sure to <Link href={`/league/${league_id}/my_team`}>set your lineup.</Link></p>
            </header>

            <section className="bg-slate-300 p-6 rounded-lg">
                <h1 className='text-2xl mb-5'>Team Standings</h1>
                <div className='grid grid-cols-4 gap-3'>
                    {/* <h2 className='text-wrap'>Team</h2> */}
                    {/* <h2 className='text-sm'>#</h2> */}
                    <h2 className='text-wrap text-sm'>Manager</h2>
                    <h2 className='text-wrap text-sm'>Rounds Survived</h2>
                    <h2 className='text-wrap text-sm'>Remaining Players</h2>
                    <h2 className='text-wrap text-sm'>Mistake Count</h2>
                {enhancedTeams?.flatMap((t, i) => {
                    // const rank = t.sortString === enhancedTeams[i-1]?.sortString ? 
                    return <>
                        {/* <h3 key={`team_name_${i}`}>{t.team_name}</h3> */}
                        {/* <h3 key={`rank_${i}`}>{i + 1}</h3> */}
                        <h3 key={`manager_${i}`}>{t.app_user?.first_name} {t.app_user?.last_name}</h3>
                        <h3 key={`rounds_survived_${i}`}>{t.roundsSurvived}</h3>
                        <h3 key={`remaining_players_${i}`}>{t.bench.length}</h3>
                        <h3 key={`mistake_count_${i}`}>{t.mistakeCount}</h3>
                    </>
                })}
                </div>
            </section>
        </div>
    );
}