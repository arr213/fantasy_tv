import React from 'react';
import { createClient } from "@/utils/supabase/server";
import { Avatar, Container, Link } from '@mui/material';
import { DateTime } from 'luxon';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

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

    let {data: teams, error: teamsError} = await supabase
        .from('team')
        .select('id, team_name, app_user(first_name, last_name)')
        .eq('league_id', Number(league_id))
    if (!teams || teamsError) console.error('Error getting teams.', teamsError);
    if (!teams) teams = [];

    const {data: contestants, error: contestantsError} = await supabase.rpc('get_contestants', {the_league_id: Number(league_id)});
    if (contestantsError || !contestants) console.error('Error getting contestants.', contestantsError);
    if (!contestants) return <></>;

    const { data: survivalRecords, error: survivalRecordsError } = await supabase
        .from('survival_record')
        .select(`
        id,
        team_id,
        contestant_id,
        round_id,
        team (
            league_id
        ),
        round (
            round_number
        )
        `)
        .eq('team.league_id', Number(league_id))
        .order('round_id', { ascending: true });
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

    const enhancedTeams = teams.map(t => {
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
        const mainSortString = isStillInGame 
            ? `1_${bench.length.toString().padStart(3, '0')}`
            : `0_${roundsSurvived.toString().padStart(3, '0')}`
        ;
        const consolationSortString = `${mistakeCount.toString().padStart(3, '0')}`;
        return {...t, records, bench, roundsSurvived, mistakeCount, isStillInGame, mainSortString, consolationSortString};
    });
    type EnhancedTeam = typeof enhancedTeams[0];
    type TeamWithRank = EnhancedTeam & { rank: number; rankString: string; };
    function toOrdinal(n: number): string {
        const s = ["th", "st", "nd", "rd"],
              v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      }

    const mainRows = enhancedTeams
        .sort((a, b) => {
            if (a.mainSortString > b.mainSortString) return -1;
            if (a.mainSortString < b.mainSortString) return 1;
            return 0;
        })
        .reduce<TeamWithRank[]>((acc, t, i) => {
            const rank = t.mainSortString === enhancedTeams[i-1]?.mainSortString ? acc[acc.length - 1].rank : i + 1;
            const row = {...t, rank, rankString: toOrdinal(rank)};
            acc.push(row);
            return acc;
        }, []);

    const consolationRows = enhancedTeams
        .sort((a, b) => {
            if (a.consolationSortString > b.consolationSortString) return -1;
            if (a.consolationSortString < b.consolationSortString) return 1;
            return 0;
        })
        .reduce<TeamWithRank[]>((acc, t, i) => {
            const rank = t.consolationSortString === enhancedTeams[i-1]?.consolationSortString ? acc[acc.length - 1].rank : i + 1;
            const row = {...t, rank, rankString: toOrdinal(rank)};
            acc.push(row);
            return acc;
        }, [])
        .filter(t => t.mistakeCount > 0);

    const pendingRounds = rounds
        .filter(r => DateTime.fromISO(r.deadline_date_time, {zone: 'America/New_York'}) < DateTime.now() /* && !r.evicted_contestant */)
    
    const mainColCount = 4 + pendingRounds.length;
    return (
        <Container className="overflow-x-scroll">
        <div >
            <header className="flex flex-col justify-between my-5">
                <h1 className='text-2xl'>Welcome to {league?.league_name}!</h1>
                <p className='text-sm'>
                    If you haven't yet, please be sure to check out the <Link href={`/league/${league_id}/rules`}>rules of the league</Link>, and be sure to <Link href={`/league/${league_id}/my_team`}>set your lineup.</Link></p>
            </header>

            <section className="rounded-lg text-center flex flex-col items-start">
                <h1 className="text-2xl mb-5 w-100">Survival Standings</h1>
                <table className="min-w-full divide-y divide-gray-200 table-auto border-collapse border border-slate-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="text-center border-collapse border border-slate-200 text-xs md:text-base lg:text-lg font-medium text-gray-500 uppercase tracking-wider text-wrap">{' '}</th>
                            <th scope="col" className="text-center border-collapse border border-slate-200 text-xs md:text-base lg:text-lg font-medium text-gray-500 uppercase tracking-wider text-wrap">Team</th>
                            <th scope="col" className="text-center border-collapse border border-slate-200 text-xs md:text-base lg:text-lg font-medium text-gray-500 uppercase tracking-wider text-wrap">Rounds Survived</th>
                            <th scope="col" className="text-center border-collapse border border-slate-200 text-xs md:text-base lg:text-lg font-medium text-gray-500 uppercase tracking-wider text-wrap">Remaining Players</th>
                            {pendingRounds.map((round, i) => (
                                <th key={`pending_round_${i}`} scope="col" className="text-center border-collapse border border-slate-200 text-xs md:text-base lg:text-lg font-medium text-gray-500 uppercase tracking-wider text-wrap">
                                    {round.display_name}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            <th scope="col" className="text-center border-collapse border border-slate-200 text-xs md:text-base lg:text-lg font-medium text-gray-500 uppercase tracking-wider text-wrap">{' '}</th>
                            <th scope="col" className="text-center border-collapse border border-slate-200 text-xs md:text-base lg:text-lg font-medium text-gray-500 uppercase tracking-wider text-wrap">{' '}</th>
                            <th scope="col" className="text-center border-collapse border border-slate-200 text-xs md:text-base lg:text-lg font-medium text-gray-500 uppercase tracking-wider text-wrap">{' '}</th>
                            <th scope="col" className="text-center border-collapse border border-slate-200 text-xs md:text-base lg:text-lg font-medium text-gray-500 uppercase tracking-wider text-wrap">{' '}</th>
                            {pendingRounds.map((round, i) => (
                                <th key={`pending_round_${i}`} scope="col" className="text-center border-collapse border border-slate-200 text-xs md:text-base lg:text-lg font-medium text-gray-700 uppercase tracking-wider text-wrap">
                                    {contestantMap[round.evicted_contestant]?.display_name|| "TBD"}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {mainRows.map((t, i) => {
                        const rowBackground = t.isStillInGame ? 'even:bg-gray-100 odd:bg-white' : 'even:bg-red-200 odd:bg-red-100';
                        return (
                        <tr key={`row_${i}`} className={rowBackground}>
                            <td className="border-collapse border border-slate-200 py-4 whitespace-nowrap">{t.rankString}</td>
                            <td className="border-collapse border border-slate-200 py-4 whitespace-nowrap">
                                <div>
                                    <h3 className='text-sm text-wrap'>{t.team_name}</h3>
                                    <h3 className='text-slate-500 text-sm'>{t.app_user?.first_name} {t.app_user?.last_name}</h3>
                                </div>
                                
                            </td>
                            <td className="border-collapse border border-slate-200 py-4 whitespace-nowrap">{t.roundsSurvived}</td>
                            <td className="border-collapse border border-slate-200 py-4 whitespace-nowrap">{t.bench.length}</td>
                            {pendingRounds.map((round, j) => (
                                <td className="border-collapse border border-slate-200 py-4 whitespace-nowrap">
                                    <div>
                                        {/* <div className="w-full flex text-center items-center">
                                            <Avatar className='h-2 w-2 mx-auto'  />
                                        </div> */}
                                        <h3 className='text-slate-700 text-sm'>{t.records.find(rec => rec.round_id === round.round_id)?.contestant?.display_name || ""}</h3>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    )})}
                    </tbody>
                </table>
            </section>
            
            {/* {consolationRows.length && (
                <section className="bg-slate-300 p-6 rounded-lg">
                    <h1 className='text-2xl mb-5'>Consolation Standings</h1>
                    <div className='grid grid-cols-4 gap-3'>
                        <h2 className='text-sm'>#</h2>
                        <h2 className='text-wrap text-sm'>Manager</h2>
                        <h2 className='text-wrap text-sm'>Team Name</h2>
                        <h2 className='text-wrap text-sm'>Mistake Count</h2>
                        {consolationRows.flatMap((t, i) => (
                            <>
                                <h3 key={`rank_${i}`}>{t.rankString}</h3>
                                <h3 key={`manager_${i}`}>{t.app_user?.first_name} {t.app_user?.last_name}</h3>
                                <h3 key={`team_name_${i}`}>{t.team_name}</h3>
                                <h3 key={`mistake_count_${i}`}>{t.mistakeCount}</h3>
                            </>
                        ))}
                    </div>
                </section>
            )} */}
            {consolationRows.length > 0 && (
                <section className="rounded-lg text-center flex flex-col items-start mt-8">
                    <h1 className="text-2xl mb-5 w-100">Consolation Standings</h1>
                    <table className="min-w-full divide-y divide-gray-200 table-auto border-collapse border border-slate-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="text-center border-collapse border border-slate-200 text-xs md:text-base lg:text-lg font-medium text-gray-500 uppercase tracking-wider">#</th>
                                <th scope="col" className="text-center border-collapse border border-slate-200 text-xs md:text-base lg:text-lg font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                                <th scope="col" className="text-center border-collapse border border-slate-200 text-xs md:text-base lg:text-lg font-medium text-gray-500 uppercase tracking-wider">Team Name</th>
                                <th scope="col" className="text-center border-collapse border border-slate-200 text-xs md:text-base lg:text-lg font-medium text-gray-500 uppercase tracking-wider">Mistake Count</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {consolationRows.map((t, i) => {
                                return (
                                    <tr key={`consolation_row_${i}`} className="even:bg-gray-100 odd:bg-white">
                                        <td className="border-collapse border border-slate-200 py-4 whitespace-nowrap">{t.rankString}</td>
                                        <td className="border-collapse border border-slate-200 py-4 whitespace-nowrap">
                                            <div>
                                                <h3 className='text-sm text-wrap'>{t.app_user?.first_name} {t.app_user?.last_name}</h3>
                                            </div>
                                        </td>
                                        <td className="border-collapse border border-slate-200 py-4 whitespace-nowrap">{t.team_name}</td>
                                        <td className="border-collapse border border-slate-200 py-4 whitespace-nowrap">{t.mistakeCount}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>
            )}




        </div>
        </Container>
    );
}