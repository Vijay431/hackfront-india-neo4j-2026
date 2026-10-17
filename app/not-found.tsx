import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-14 sm:px-6">
      <h1 className="font-heading text-5xl font-bold sm:text-6xl">
        Route not found
      </h1>
      <p className="mt-3 max-w-[50ch] text-lg text-muted-foreground">
        We only support six roles right now. More roles are coming soon.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block font-medium text-route-ink underline underline-offset-4"
      >
        Back to home
      </Link>
    </main>
  );
}
