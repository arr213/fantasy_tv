import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveTeamName(team, formData: FormData) {
    "use server";
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const team_name = formData.get('team_name') as string;
    if (!team) return;

    const id = await supabase.from('team').upsert({...team, team_name});
    revalidatePath(`/league/${team.league_id}/my_team`);
}

export async function saveLineup(team, lineup) {
    "use server";
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!team) return;
    if (!lineup || !lineup.length) return;

    const id = await supabase.rpc('create_team_lineup', {the_team_id: team.id, contestant_ids: lineup.map(c => c.contestant_id)});
    revalidatePath(`/league/${team.league_id}/my_team`);

}