
import { redirect } from "next/navigation";
import { Button } from "@mui/material";

import { createClient } from "@/utils/supabase/server";
import ProcessSurvivalForm from "./processForm";
import RoundGrid from "./roundGrid";
import DateTimeForm from "./dateTimeForm";

export default async function AdminPage({params}: {params: {league_id: string}}) {
  const supabase = createClient();
  const { data: { user }} = await supabase.auth.getUser();

  if (!user) return redirect("/login");
  const { data: league, error: leagueError } = await supabase.from("league").select("*").eq("id", Number(params.league_id)).single();
  if (!league || leagueError) {
    console.error('Error getting league.', leagueError);
  }
  const { data: leagueAdmins, error: leagueAdminsError } = await supabase.from("league_admin").select("*").eq("league_id", Number(params.league_id));
  if (!leagueAdmins || leagueAdminsError || !leagueAdmins.find((admin) => admin.email === user.email)) {
    debugger;
    return redirect("/");
  }
  const {data: contestants, error: contestantsError} = await supabase.rpc('get_contestants', {the_league_id: Number(params.league_id)});
  if (contestantsError || !contestants) console.error('Error getting contestants.', contestantsError);

  let {data: rounds, error: roundsError } = await supabase.rpc("get_rounds_with_evictions", {the_league_id: Number(params.league_id)});
  if (!rounds || roundsError) {
    console.error('Error getting rounds.', roundsError);
    rounds = [];
  }

  if (!league || !contestants) return <></>;

  return (
    <div className="w-dvw lg:w-3/4">
      <header className="flex justify-between mb-10">
        <h1 className='text-2xl'>{league?.league_name} Admin</h1>
      </header>
      <section className="">
        <h1 className='text-2xl mb-5'>Season Manager</h1>
        <div className='flex flex-col'>
          <div className="flex gap-4">
            <h2 className="text-xl">Rounds</h2>
            <ProcessSurvivalForm league_id={league.id} />
            <DateTimeForm />
          </div>
          <RoundGrid rounds={rounds} contestants={contestants} dateTimePicker={true} />
        </div>
      </section>
      <section>
        <h1 className='text-2xl mb-5'>Send Email Update</h1>
        <Button>Send Email</Button>
      </section>
    </div>
  );
}