import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { DateTime } from "luxon";
import _ from "lodash";



export async function POST(request: Request){
  const supabase = createClient();
  
  // Fetch required data
  const {data: teams, error: teamsError} = await supabase.rpc('get_team_summary', {the_league_id: Number(params.league_id)});
  if (teamsError || !teams) console.error('Error getting teams.', teamsError);

  const {data: roundsWithEvictions, error: roundsError} = await supabase.rpc('get_rounds_with_evictions', {the_league_id: Number(params.league_id)});
  if (roundsError || !roundsWithEvictions) console.error('Error getting rounds.', roundsError);

  const {data: contestants, error: contestantsError} = await supabase.rpc('get_contestants', {the_league_id: Number(params.league_id)});
  if (contestantsError || !contestants) console.error('Error getting contestants.', contestantsError);

  const {data: lineups, error: lineupsError} = await supabase.rpc('get_all_lineups', {the_league_id: Number(params.league_id)});
  if (lineupsError || !lineups) console.error('Error getting lineups.', lineupsError);

  if (!teams || !roundsWithEvictions || !contestants || !lineups) return NextResponse.error();


  const lineupMap = _.groupBy(lineups, 'team_id');


  // Sort thru and create a list of the teams and their submissions
  let teamSubmissions = [];
  for (let t of teams) {
    for (let l of lineupMap[t.team_id]) {
      if (l.round_id === roundsWithEvictions[0].round_id) {
        teamSubmissions.push(l);
      }

    }
  }

  for (let r of roundsWithEvictions) {
    let roundSubmissions = [];
    for (let l of lineups) {
      if (l.round_id === r.round_id && r.deadline_date_time < DateTime.now().toISO()) {
        roundSubmissions.push(l);


      }
    }
    teamSubmissions.push(...roundSubmissions);
  }
  // Create and delete submissions in one operation 
  // Must code create_round_submissions in the db
  const {data: teams, error: teamsError} = await supabase.rpc('create_survival_submissions', {submissions: teamSubmissions});

  
}
