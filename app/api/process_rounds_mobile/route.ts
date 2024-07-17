// 
// 
// This is just a sample for writing "process_submissions"
// 
// 
// 

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export function POST(request: Request){
  const supabase = createClient();
  
  const {data, error} = await supabase.
}
