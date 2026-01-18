export default function Dashboard() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        Your generated content and usage stats will appear here.
      </p>
      <div className="mt-8 rounded-lg border border-zinc-200 p-8 text-center dark:border-zinc-800">
        <p className="text-zinc-500">No content generated yet.</p>
      </div>
    </main>
  );
}
