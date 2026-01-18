import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

type RequestBody = {
  topic: string;
  tone: "Informative" | "Casual" | "Comedic";
  length: "30s" | "45s" | "60s";
};

const FREE_LIMIT = 3;

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const isPro = user.publicMetadata?.pro === true;
    const freeCount =
      typeof user.privateMetadata?.freeCount === "number"
        ? user.privateMetadata.freeCount
        : 0;

    if (!isPro && freeCount >= FREE_LIMIT) {
      return NextResponse.json(
        { error: "Free limit reached" },
        { status: 402 }
      );
    }

    const body: RequestBody = await request.json();
    const { topic, tone, length } = body;

    if (!topic || !tone || !length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Mock response - will be replaced with AI later
    const hooks: Record<string, string> = {
      Informative: `Here's something most people don't know about ${topic}...`,
      Casual: `Okay so let's talk about ${topic} real quick...`,
      Comedic: `I tried ${topic} so you don't have to. Here's what happened...`,
    };

    const bodies: Record<string, string> = {
      Informative: `When it comes to ${topic}, there are three key things you need to understand. First, the fundamentals matter more than you think. Second, consistency beats intensity every single time. And third, the best time to start was yesterday, but the second best time is right now.`,
      Casual: `So here's the deal with ${topic}. I've been doing this for a while now and honestly? It's not as hard as people make it seem. The trick is to just start small and build from there. Don't overthink it.`,
      Comedic: `${topic} is like my love life - confusing, occasionally rewarding, and my mom keeps asking me about it. But seriously, once you get past the initial awkwardness, it's actually pretty great.`,
    };

    const ctas: Record<string, string> = {
      Informative: `Follow for more insights on ${topic}. Save this for later and share with someone who needs to hear this.`,
      Casual: `If this was helpful, smash that follow button. Drop a comment if you want more ${topic} content!`,
      Comedic: `Follow if you laughed. Or don't. I'm not your mom. But she'd want you to follow. Call your mom.`,
    };

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Increment freeCount for non-pro users
    if (!isPro) {
      await client.users.updateUserMetadata(userId, {
        privateMetadata: {
          freeCount: freeCount + 1,
        },
      });
    }

    return NextResponse.json({
      hook: hooks[tone],
      body: bodies[tone],
      cta: ctas[tone],
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 }
    );
  }
}
