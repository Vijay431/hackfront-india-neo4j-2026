import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <h1 className="text-2xl font-bold">Role not found</h1>
      <p className="mt-2 text-muted-foreground">
        We only support five roles right now. More roles are coming soon.
      </p>
      <Link href="/" className="mt-4 inline-block underline">
        Back to roles
      </Link>
    </main>
  );
}
