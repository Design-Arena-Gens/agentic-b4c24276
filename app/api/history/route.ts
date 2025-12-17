import { NextResponse } from "next/server";
import { fetchLatestChannelVideos } from "@/lib/youtube";

export const revalidate = 60;

export async function GET() {
  try {
    const videos = await fetchLatestChannelVideos(6);
    return NextResponse.json({ videos });
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message ?? "Failed to fetch recent uploads"
      },
      { status: 500 }
    );
  }
}
