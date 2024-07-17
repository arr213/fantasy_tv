import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export function POST({the_league_id}){
  const supabase = createClient();
  
  const {data, error} = await supabase.
}
