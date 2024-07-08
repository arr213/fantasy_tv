import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import _ from 'lodash';

const adjectiveList = ['Amazing','Bold','Crazy','Dynamic','Energetic','Fantastic','Gigantic','Heroic','Incredible','Jubilant','Kooky','Legendary','Marvelous','Notorious','Outstanding','Phenomenal','Quirky','Radiant','Spectacular','Tremendous','Unstoppable','Vibrant','Wacky','Zany','Wild'];
const nounList = ['Aces','Bandits','Comp-Beasts','Champs','Crew','Defenders','Explorers','Floaters','Heroes','Legends','Mavericks','Ninjas','Outlaws','Pioneers','Rangers','Rockstars','Savages','Squad','Titans','Troopers','Warriors','Wizards','Yahoos','Beasts','Giants','Masters'];

export async function joinLeague({user_email, league_id, user_first_name}: {user_email: string, league_id: number, user_first_name: string}) {
  "use server";
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const {error} = await supabase.from("team").insert({
    team_name: `${user_first_name}'s ${_.sample(adjectiveList)} ${_.sample(nounList)}`,
    league_id: league_id,
    manager_email: user_email
  });
  if (error) {
    console.error('Error creating team.', error);
    throw "Error joining the league. Please try again."
  }

  return redirect(`/league/${league_id}`);
}