import { createClient } from "@/utils/supabase/server";
import { AccountCircle } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { User } from "@supabase/auth-js";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { UserMenu } from "./UserMenu";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  async function navigateToProfile() {
    'use server';
    return redirect("/profile");
  }

  return user ? (
    <UserMenu signOut={signOut} navigateToProfile={navigateToProfile} />
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}





