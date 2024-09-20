import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getLatestDraft(
    team: Database['public']['Tables']['team']['Row'], 
    formData: FormData
) {
    "use server";
    const supabase = createClient();
    const { data: lineups } = await supabase.rpc('get_team_lineup', { the_league_id: 1, team_manager_email: 'arr213@gmail.com' });

    console.log('lineups:', lineups);
    
}
