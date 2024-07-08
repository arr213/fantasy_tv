import DeployButton from "../components/DeployButton";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import ConnectSupabaseSteps from "@/components/tutorial/ConnectSupabaseSteps";
import SignUpUserSteps from "@/components/tutorial/SignUpUserSteps";
import Header from "@/components/Header";
import { redirect } from "next/navigation";
import { Card, Icon, Paper } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Link from "next/link";
import { joinLeague } from "@/actions/join_league";
import JoinLeagueSection from "./joinLeagueSection";

export default async function Index() {

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }
  const {
    data: app_user,
  } = await supabase.from("app_user")
    .select("*")
    .eq("email", user.email!)
    .single();

  if (!app_user || !app_user.first_name || !app_user.last_name) {
    return redirect("/profile");
  }

  const {data: myLeagues, error: myLeaguesError} = await supabase.rpc('get_my_leagues', {user_email: user.email!});
  const {data: openLeagues, error: openLeaguesError} = await supabase.from('league').select('*').eq('league_status', 'open_signup');
  const joinableLeagues = openLeagues?.filter(league => !myLeagues?.find(myLeague => myLeague.id === league.id)) || [];


  if (myLeaguesError) {
    console.error('Error getting my leagues.', myLeaguesError);
  }
  const {data: availableLeagues, error: availableLeaguesError} = await supabase.rpc('get_available_leagues', {user_email: user.email!});

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <Header />
        <main className="flex-1 flex flex-col gap-6">

          {
            myLeagues && myLeagues.length > 0 && (
              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-4xl">Your Leagues:</h2>
                
                {
                  myLeagues.map(league => (
                    <Link key={league.id} href={`/league/${league.id}`}>
                      <Card className="w-80 rounded-md p-2 bg-slate-200 min-h-40">
                          <h3 className="font-bold text-2xl">{league.league_name}</h3>
                          {/* 
                            Add conditional notes about the state of the league??
                              - If league hasn't started
                                - include note about the start date.
                                - if they still have original picks, include reminder to make picks.
                              - If league is in progress
                                - How many players are left?
                                - What place are they in?
                                - How many contestants are left on their bench?

                            Eg.
                            <p className="text-lg">You are currently in 1st place!</p>
                            <p className="text-lg">You have 5 players remaining</p>
                            
                          */}
                      </Card>
                    </Link>
                  ))
                }
              </div>
            )
          }

          <JoinLeagueSection app_user={app_user} joinableLeagues={joinableLeagues} joinLeague={joinLeague} />
      
        </main>

      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Expect the unexpected
        </p>
      </footer>
    </div>
  );
}
