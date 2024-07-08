import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Nav from "@/components/Nav";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Fantasy Big Brother",
  description: "The best way to enjoy Big Brother with your friends!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning={true}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center w-dvw">
          <Nav />
          {children}
        </main>
      </body>
    </html>
  );
}
