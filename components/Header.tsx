import NextLogo from "./NextLogo";
import SupabaseLogo from "./SupabaseLogo";

export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <h1 className="md:text-6xl text-4xl">Fantasy Big Brother</h1>
      </div>
      <p className="text-2xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        The fantasy sports center for reality television
      </p>
    </div>
  );
}
