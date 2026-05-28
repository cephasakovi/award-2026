import { NextResponse } from "next/server";

import { createDailySnapshot } from "@/lib/exports/snapshot";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return false;
  }

  const authHeader = request.headers.get("authorization");
  const bearer = `Bearer ${cronSecret}`;
  if (authHeader === bearer) {
    return true;
  }

  // Vercel Cron also sends this header on scheduled calls.
  const vercelCronHeader = request.headers.get("x-vercel-cron");
  return vercelCronHeader === "1";
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await createDailySnapshot();
    return NextResponse.json({
      ok: true,
      snapshotId: snapshot.id,
      fileName: snapshot.fileName,
      createdAt: snapshot.createdAt,
      totalVotes: snapshot.totalVotes,
    });
  } catch (error) {
    console.error("Daily export cron failed:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
