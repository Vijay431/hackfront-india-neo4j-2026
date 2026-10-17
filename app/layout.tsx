import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import Link from "next/link";
import { logoutAction } from "./actions";
import { getOptionalUid } from "@/lib/session";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerPath AI",
  description: "Skill-graph powered career roadmaps",
};

function Mark() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
      <path d="M4 20 10 9l4 6 2-3 4 8Z" fill="currentColor" />
      <circle cx="17.5" cy="6" r="2.25" fill="var(--route)" />
    </svg>
  );
}

async function Nav() {
  const uid = await getOptionalUid();
  if (!uid) return null;
  return (
    <nav
      aria-label="Main"
      className="flex items-center gap-1 text-sm font-medium"
    >
      <Link href="/path" className="rounded-md px-3 py-2 hover:bg-white/10">
        Change path
      </Link>
      <Link href="/roadmap" className="rounded-md px-3 py-2 hover:bg-white/10">
        My roadmap
      </Link>
      <span
        className="hidden max-w-[16ch] truncate px-2 text-primary-foreground/70 md:inline"
        title={uid}
      >
        {uid}
      </span>
      <form action={logoutAction}>
        <button
          type="submit"
          className="rounded-md px-3 py-2 hover:bg-white/10"
        >
          Log out
        </button>
      </form>
    </nav>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowCondensed.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="bg-primary text-primary-foreground">
          <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-heading text-xl font-bold tracking-wide uppercase"
            >
              <Mark />
              CareerPath <span className="text-route">AI</span>
            </Link>
            <Suspense fallback={null}>
              <Nav />
            </Suspense>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
