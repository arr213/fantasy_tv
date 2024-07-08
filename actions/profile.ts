import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function saveProfile(formData: FormData) {
  "use server";
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const email = (formData.get('email') || user?.email) as string;
  const first_name = formData.get('first_name') as string;
  const last_name = formData.get('last_name') as string;
  const id = await supabase.from('app_user').upsert({ email, first_name, last_name });

  return redirect("/");
}