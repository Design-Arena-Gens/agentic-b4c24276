import { NextResponse } from "next/server";
import { runAutomation } from "@/lib/automation";
import { getEnv } from "@/lib/env";

function authorize(req: Request, cronSecret?: string | null) {
  if (!cronSecret) {
    return req.headers.get("x-vercel-cron") === "1";
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.replace("Bearer ", "").trim();
  return token === cronSecret;
}

async function handler(req: Request) {
  let env;
  try {
    env = getEnv();
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Missing environment configuration" },
      { status: 500 }
    );
  }

  const isAuthorized = authorize(req, env.CRON_SECRET ?? null);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const trigger =
      req.headers.get("x-vercel-cron") === "1" ? "vercel-cron" : "manual-request";
    const result = await runAutomation({ trigger });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Automation failed", error);
    return NextResponse.json(
      {
        error: (error as Error).message ?? "Automation failed"
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return handler(request);
}

export async function POST(request: Request) {
  return handler(request);
}
