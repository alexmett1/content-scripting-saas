import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Content Scripting with AI
        </h1>
        <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
          Generate high-quality scripts for videos, podcasts, and more using AI.
          Save time and scale your content production.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/generate"
            className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Start Generating
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-zinc-300 px-6 py-3 font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
