import { createClient } from '@/utils/supabase/server';
import { AppBar, Button, Link, Toolbar, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

export default async function Layout({children, params
}: {
    children: React.ReactNode;
    params: {league_id: string}
}) {
    const supabase = createClient();
    const {data: league, error: leagueError } = await supabase.from("league").select("*").eq("id", params.league_id).single();
    const {data: admins, error: adminsError} = await supabase.from("league_admin").select("*").eq("league_id", Number(params.league_id));
    const {
        data: { user },
      } = await supabase.auth.getUser();
    
    if (leagueError) {
        console.error('Error getting league.', leagueError);
    }

    return (
        <>
            <AppBar position="static" className="bg-blue-900 w-dvw -mt-4">
                <Toolbar className="flex flex-col md:flex-row md:justify-between lg:w-3/4 mx-auto">
                    <Typography variant="h6" className="text-white mb-2 md:mb-0">
                        {league?.league_name}
                    </Typography>
                    <div className="flex space-x-4">
                        <Link href={`/league/${params.league_id}`}>
                            <Button className="text-white">League Home</Button>
                        </Link>
                        <Link href={`/league/${params.league_id}/my_team`}>
                            <Button className="text-white">My Team</Button>
                        </Link>
                        <Link href={`/league/${params.league_id}/rules`}>
                            <Button className="text-white">League Rules</Button>
                        </Link>
                        {admins && admins.some(a => a.email === user?.email) && (
                            <Link href={`/league/${params.league_id}/admin`}>
                                <Button className="text-white">Admin</Button>
                            </Link>
                        )}
                    </div>
                </Toolbar>
            </AppBar>
            {children}
        </>
    );
}

