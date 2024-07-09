import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


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
    return redirect("/");
  }

  const { data: rounds, error: roundsError } = await supabase.from("round").select("*").eq("league_id", Number(params.league_id));
  if (!rounds || roundsError) {
    console.error('Error getting rounds.', roundsError);
  }

  return (
    <div>
      <header className="flex justify-between mb-10">
        <h1 className='text-2xl'>{league?.league_name} Admin</h1>
      </header>
      <section className="bg-slate-300 p-10 rounded-lg">
        <h1 className='text-2xl mb-5'>League Standings</h1>
        <div className='grid grid-cols-2 gap-3'>
          <h2>Team</h2>
          <h2>Manager</h2>
          <h1>Remaining Players</h1>
          <></>
          <></>
        </div>
      </section>
    </div>
  );
}