import { createClient } from "@/utils/supabase/server";
import { EmailOtpType, MobileOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType;
  const origin = requestUrl.origin;

  if (token_hash && type) {
    const supabase = createClient();
    console.log('token_hash', token_hash, type)
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    
    if (error) {
        console.log("Error authenticating:", error)
      return NextResponse.redirect(`${origin}/login?message=Could not authenticate user`);
    }
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/protected`);
}

