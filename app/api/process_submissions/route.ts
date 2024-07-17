import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import _ from "lodash";

import { createClient } from "@/utils/supabase/server";



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
  let submissions = [];
  for (let t of teams) {
    let teamSubmissions = [];
    for (let l of lineupMap[t.team_id]) {
      let round = roundsWithEvictions.find(r => r.id === l.round_id)
      let alreadyEliminated = roundsWithEvictions.filter(r =>r.round_number < l.round_number).map
      let alreadySubmitted = teamSubmissions.map(s => s.contestant_id)
      let chosenContestantId = Array.from(l.contestant_ids).push(...contestants.map(c =>c.id)).filter(c_id => !alreadyEliminated.includes(c_id) && !alreadySubmitted.includes(c_id))[0]
      let newSubmission = {
        round_id: l.round_id,
        team_id: l.team_id,
        contestant_id: chosenContestantId
      };
      teamSubmissions.push(newSubmission)
    }
    submissions.push(...teamSubmissions)
  }

  // Create and delete submissions in one operation 
  // Must code create_round_submissions in the db
  const {data: teams, error: teamsError} = await supabase.rpc('create_survival_submissions', {submissions: submissions});

  
}
