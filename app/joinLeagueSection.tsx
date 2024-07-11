"use client";

import { Card, Icon, Paper } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { joinLeague } from "@/actions/join_league";
import { Database } from "@/database.types";

export default function JoinLeagueSection({app_user, joinableLeagues, joinLeague}:{
    app_user: Database['public']['Tables']['app_user']['Row'];
    joinableLeagues: Database['public']['Tables']['league']['Row'][];
    joinLeague: (o: {user_email: string, league_id: number, user_first_name: string}) => Promise<never>;
}) {
    if (!app_user || !joinableLeagues || !joinLeague || !joinableLeagues.length)  return <></>;
    return (
      <div>
        <h2 className="font-bold text-4xl mb-4">Join a league:</h2>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">{
          joinableLeagues.map(league => (
            <Card 
              key={league.id} 
              className="w-80 rounded-md p-2 bg-slate-200 min-h-40 flex flex-col" 
              onClick={async function() {
                const res = await joinLeague({
                  user_email: app_user.email, 
                  league_id: league.id, 
                  user_first_name: app_user.first_name || app_user.email
                })
                console.log("Res:", res);
                }}>
              <h3 className="font-bold text-2xl">{league.league_name}</h3>
              <div className="flex-grow flex items-center justify-center h-auto">
                <AddCircleIcon className="text-6xl" />
              </div>
            </Card>
          ))
        }</div>
      </div>
    )
  }