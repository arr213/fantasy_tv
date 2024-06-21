import DeployButton from "../components/DeployButton";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import ConnectSupabaseSteps from "@/components/tutorial/ConnectSupabaseSteps";
import SignUpUserSteps from "@/components/tutorial/SignUpUserSteps";
import Header from "@/components/Header";
import { redirect } from "next/navigation";

export default async function Index() {

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }
  const {
    data: { app_user },
  } = await supabase.from("app_user").select("*").eq("id", user?.email).single();

  if (!app_user || app_user.firstName) {
    return redirect("/login");

  }


  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-end items-center p-3 text-sm">
            <AuthButton />
        </div>
      </nav>

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <Header />
        <main className="flex-1 flex flex-col gap-6">
          <h2 className="font-bold text-4xl mb-4">Find your league</h2>
          <div className="rounded-sm bg-slate-500 min-h-40 min-w-1 ">
            <div className="flex justify-center items-center h-full">
              <p className="text-2xl text-center">
                <span className="font-bold">Fantasy Big Brother</span> is the fantasy sports center for reality television.
              </p>
            </div>
          </div>
          
        </main>

      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Expect the unexpected {" "}
          {/* <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a> */}
        </p>
      </footer>
    </div>
  );
}
