
import { createClient } from '@/utils/supabase/server';
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default async function POST(
  req: Request,
  res: NextApiResponse
) {
  // const data = req.body as { email: string; first_name: string; last_name: string; };
  const formData = await req.formData()
  const email = formData.get('email')
  const first_name = formData.get('first_name');
  const last_name = formData.get('last_name');
  const supabase = createClient();
  const id = await supabase.from('app_user').upsert({email, first_name, last_name});
  console.log("Success", id)
  res.status(200).json({ id })
}

