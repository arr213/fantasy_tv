import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";



export async function POST({params}){
  const supabase = createClient();
  

  const {data: teams, error: teamsError} = await supabase.rpc('get_team_summary', {the_league_id: Number(params.league_id)});
  if (teamsError) console.error('Error getting teams.', teamsError);

  const {data: roundsWithEvictions, error: roundsError} = await supabase.rpc('get_rounds_with_evictions', {the_league_id: Number(params.league_id)});
  if (roundsError) console.error('Error getting rounds.', roundsError);

  const {data: contestants, error: contestantsError} = await supabase.rpc('get_contestants', {the_league_id: Number(params.league_id)});
  if (contestantsError) console.error('Error getting contestants.', contestantsError);

  const {data: lineups, error: lineupsError} = await supabase.rpc('get_all_lineups', {the_league_id: Number(params.league_id)});
  if (lineupsError) console.error('Error getting lineups.', lineupsError);

  // Fetch all lineups
  // Fetch all teams
  // Sort thru and create a list of the teams and their submissions
  // Create and delete submissions in one operationimport { createClient } from "@/utils/supabase/server";
}
