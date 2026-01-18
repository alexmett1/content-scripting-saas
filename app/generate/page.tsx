"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function GenerateContent() {
  const searchParams = useSearchParams();
  const paid = searchParams.get("paid") === "1";
  const canceled = searchParams.get("canceled") === "1";

  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Informative");
  const [length, setLength] = useState("30s");
  const [script, setScript] = useState<{
    hook: string;
    body: string;
    cta: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setScript(null);
    setShowPaywall(false);

    try {
      const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, length }),
      });

      if (response.status === 402) {
        setShowPaywall(true);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to generate script");
      }

      const data = await response.json();
      setScript(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Failed to start checkout. Please try again.");
      setUpgrading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Generate Script</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        Create AI-powered scripts for your content.
      </p>

      {paid && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400">
          Payment successful! You now have unlimited access.
        </div>
      )}

      {canceled && (
        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-400">
          Checkout canceled. You can upgrade anytime to unlock unlimited generations.
        </div>
      )}

      {showPaywall && (
        <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold">Free limit reached</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            You&apos;ve used all 3 free generations. Upgrade to Pro for unlimited access.
          </p>
          <button
            onClick={handleUpgrade}
            disabled={upgrading}
            className="mt-4 rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {upgrading ? "Redirecting..." : "Upgrade ($9/mo)"}
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800"
      >
        <div>
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Topic
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., productivity tips for developers"
            required
            disabled={loading}
            className="mt-2 w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="tone"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Tone
            </label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              disabled={loading}
              className="mt-2 w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
            >
              <option>Informative</option>
              <option>Casual</option>
              <option>Comedic</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="length"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Length
            </label>
            <select
              id="length"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              disabled={loading}
              className="mt-2 w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
            >
              <option>30s</option>
              <option>45s</option>
              <option>60s</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Generating..." : "Generate Script"}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {script && (
        <div className="mt-8 space-y-4 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-xl font-semibold">Generated Script</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Hook
              </h3>
              <p className="mt-1 rounded bg-zinc-50 p-3 dark:bg-zinc-900">
                {script.hook}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Main Script
              </h3>
              <p className="mt-1 rounded bg-zinc-50 p-3 dark:bg-zinc-900">
                {script.body}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Call to Action
              </h3>
              <p className="mt-1 rounded bg-zinc-50 p-3 dark:bg-zinc-900">
                {script.cta}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function Generate() {
  return (
    <Suspense>
      <GenerateContent />
    </Suspense>
  );
}
