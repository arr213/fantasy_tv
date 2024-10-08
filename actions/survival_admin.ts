"use server";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import _ from "lodash";

import { createClient } from "@/utils/supabase/server";
import { Database } from "@/database.types";
import { revalidatePath } from "next/cache";



export async function processSurvivalSubmissions(league_id: number | string){
  "use server"
  const the_league_id = Number(league_id);
  const supabase = createClient();
  
  // Fetch required data
  let {data: teams, error: teamsError} = await supabase.rpc('get_team_summary', {the_league_id});
  if (teamsError || !teams) console.error('Error getting teams.', teamsError);

  // console.log("The teams:", teams?.map(t => t.team_name).join("\n"));

  const {data: roundsWithEvictions, error: roundsError} = await supabase.rpc('get_rounds_with_evictions', {the_league_id});
  if (roundsError || !roundsWithEvictions) console.error('Error getting rounds.', roundsError);

  const {data: contestants, error: contestantsError} = await supabase.rpc('get_contestants', {the_league_id});
  if (contestantsError || !contestants) console.error('Error getting contestants.', contestantsError);

  const {data: lineups, error: lineupsError} = await supabase.rpc('get_all_lineups', {the_league_id});
  if (lineupsError || !lineups) console.error('Error getting lineups.', lineupsError);

  if (!teams || !roundsWithEvictions || !contestants || !lineups) return NextResponse.error();


  const lineupMap = _.groupBy(lineups, 'team_id');


  // Sort thru and create a list of the teams and their submissions
  let submissions = [] as Partial<Database['public']['Tables']['survival_record']['Row']>[];

  const rounds = lineups.map(l => l.round_number);

  const contestantMap = contestants.reduce((acc, c) => {
    acc[c.contestant_id] = c;
    return acc;
  }, {} as {[key: number]: typeof contestants[0]});

  for (let t of teams) {
    let teamSubmissions = [];
    let theLineups = lineupMap[t.team_id]?.sort((a, b) => a.round_number - b.round_number) || [];
    let flag = false;
    if (!theLineups?.length) {
      flag = true;
      theLineups = roundsWithEvictions
        .filter(r => DateTime.fromISO(r.deadline_date_time, {zone: 'America/New_York'}) < DateTime.now())
        .map(r => ({
          round_id: r.round_id,
          round_number: r.round_number,
          team_id: t.team_id,
          contestant_ids: [...contestants.map(c => c.contestant_id)],
          lineup_created_at: DateTime.fromSeconds(0).toISO(),
          lineup_id: 0
        }));
    }
    for (let l of theLineups) {
      const alreadyEliminated = roundsWithEvictions
        .filter(r =>r.round_number < l.round_number)
        .map(r => r.evicted_contestant)
      let alreadySubmitted = teamSubmissions.map(s => s.contestant_id)
      let chosenContestantId: number = l.contestant_ids
        .concat(contestants.map(c =>c.contestant_id))
        .filter(c_id => !alreadyEliminated.includes(c_id) && !alreadySubmitted.includes(c_id))[0]
      let newSubmission = {
        round_id: l.round_id,
        team_id: l.team_id,
        contestant_id: chosenContestantId
      };
      if (!l.round_id) {
        console.log("Problem:", l)
      }
      teamSubmissions.push(newSubmission)
    }
    submissions.push(...teamSubmissions)
  }

  const res = await supabase.rpc('create_survival_submissions', {the_league_id, survival_records: submissions});
  // console.log("Created Survival Records:", res);
  
}


export async function updateRound({round_id, round_number, display_name, deadline_date_time}: {
  round_id: number;
  round_number: number;
  display_name: string;
  deadline_date_time: string;
}) {
  "use server";
  const supabase = createClient();
  console.log("Updating Round Args:", {round_id, round_number, display_name, deadline_date_time});
  const {data: round, error: roundError} = await supabase.from("round").update({
    id: round_id,
    round_number,
    display_name,
    deadline_date_time
  }).eq("id", round_id).single();
  if (roundError || !round) console.error('Error updating round.', roundError);
  console.log("Updated Round:", round);
}

export async function createRound(season_id: number, league_id: number, formData: FormData) {
  "use server";
  const supabase = createClient();
  const round_number = formData.get('round_number') as string;
  const display_name = formData.get('display_name') as string;
  
  const {data: round, error: roundError} = await supabase.from("round").insert({
    round_number: Number(round_number),
    display_name,
    season_id
  }).single();
  if (roundError) {
    console.error('Error creating round.', roundError);
  } else {
    // This isn't working to refresh the page...
    revalidatePath(`/league/${league_id}/admin`);
  }
}


export async function updateEvictedContestant({round_id, evicted_contestant}: {
  round_id: number;
  evicted_contestant: number | null;
}) {
  "use server";
  const supabase = createClient();
  console.log("Updating Evicted Args:", {round_id, evicted_contestant});
  if (evicted_contestant === null) {
    const {data: round, error: roundError} = await supabase
      .from("fantasy_event")
      .delete()
      .eq("round_id", round_id)
      .eq('event_type', 'eviction')
      .single();
    if (roundError || !round) console.error('Error updating round.', roundError);
    console.log("Deleted Round:", round);
    return;
  }

  const {data: round, error: roundError} = await supabase.from("fantasy_event").upsert({
    round_id: round_id,
    contestant_id: evicted_contestant,
    event_type: "eviction"
  }).eq("id", round_id).single();
  if (roundError || !round) console.error('Error updating round.', roundError);
  console.log("Updated Round:", round);
}

// export async function sendWeeklyUpdateEmail({league_id, round_numbers}: {
//   league_id: number;
//   round_numbers: number[];
// }) {
//   "use server";
//   const supabase = createClient();
//   const [
//     {data: league, error: leagueError},
//     {data: rounds, error: roundsError}
//   ] = await Promise.all([
//     supabase.from("league").select("*").eq("id", league_id).single(),
//     supabase.rpc('get_rounds_with_evictions', {the_league_id: league_id})
//   ]);

//   if (leagueError || !league) console.error('Error getting league.', leagueError);
//   console.log("Sending Email for League:", league);
//   // Must create the send_weekly_update_email function in the db
//   const {data: email, error: emailError} = await supabase.rpc('send_weekly_update_email', {the_league_id: league_id});
//   if (emailError || !email) console.error('Error sending email.', emailError);
//   console.log("Sent Email:", email);
// }