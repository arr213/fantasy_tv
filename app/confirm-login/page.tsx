// import Link from "next/link";
// import { headers } from "next/headers";
// import { createClient } from "@/utils/supabase/server";
// import { redirect } from "next/navigation";
// import { SubmitButton } from "./submit-button";
import { Button } from "@mui/material";

export default function ConfirmLoginPage({
  searchParams,
}: {
  searchParams: { confirmation_url: string };
}) {

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <div className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="email">
          Please Confirm Sign In / Sign Up
        </label>

        <Button
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          href={searchParams.confirmation_url}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
