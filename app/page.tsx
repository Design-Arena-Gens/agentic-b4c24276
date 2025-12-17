import Image from "next/image";
import { TriggerControl } from "@/components/TriggerControl";
import { envAvailable } from "@/lib/env";
import { fetchLatestChannelVideos } from "@/lib/youtube";

function getNextIstRunDate() {
  const now = new Date();
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffsetMs);

  const target = new Date(istNow);
  target.setHours(21, 0, 0, 0);

  if (target <= istNow) {
    target.setDate(target.getDate() + 1);
  }

  const formatter = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata"
  });

  return formatter.format(target);
}

async function getLatestVideos() {
  try {
    const videos = await fetchLatestChannelVideos(6);
    return { videos, error: null as string | null };
  } catch (error) {
    return { videos: [], error: (error as Error).message };
  }
}

export default async function Page() {
  const hasEnv = envAvailable();
  const { videos, error } = hasEnv ? await getLatestVideos() : { videos: [], error: null };

  return (
    <main>
      <div className="container">
        <header>
          <h1 className="headline">Daily Animal Mayhem Automation</h1>
          <p className="subhead">
            Fully autonomous creative pipeline that scripts bizarre animal encounters, renders them
            into animated slideshows, and ships them straight to YouTube every night at 9:00 PM IST.
          </p>
        </header>

        <section className="status" style={{ marginBottom: 32 }}>
          <div className="status-item">
            <div className="status-label">Next Scheduled Run</div>
            <div className="status-value">{getNextIstRunDate()}</div>
          </div>
          <div className="status-item">
            <div className="status-label">Cron Endpoint</div>
            <div className="status-value" style={{ fontSize: "1rem" }}>
              /api/run-daily
            </div>
          </div>
          <div className="status-item">
            <div className="status-label">Configuration</div>
            <div className="status-value" style={{ color: hasEnv ? "#34d399" : "#f87171" }}>
              {hasEnv ? "Ready" : "Missing secrets"}
            </div>
          </div>
        </section>

        {!hasEnv && (
          <div className="card" style={{ borderColor: "rgba(248,113,113,0.4)", marginBottom: 32 }}>
            <h2>Environment Secrets Needed</h2>
            <p>
              Populate the required API keys and tokens in the Vercel project or local environment
              before running the automation. See <code>.env.example</code> for the full list.
            </p>
          </div>
        )}

        <div className="grid" style={{ gap: 32 }}>
          <TriggerControl />

          <div className="card">
            <h2>Recent Automations</h2>
            <p style={{ color: "rgba(226,232,240,0.75)", marginBottom: 20 }}>
              Latest uploads straight from your channel (pulled via YouTube Data API).
            </p>
            {error && <p style={{ color: "#f87171" }}>{error}</p>}
            {!error && videos.length === 0 && (
              <p>No uploads detected yet. First run will appear here.</p>
            )}
            {!error && videos.length > 0 && (
              <div className="grid grid-2">
                {videos.map(video => (
                  <div className="video-card" key={video.id}>
                    <a href={video.url} target="_blank" rel="noreferrer">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        width={480}
                        height={270}
                        style={{ width: "100%", height: "auto", borderRadius: "12px" }}
                      />
                    </a>
                    <div>
                      <a href={video.url} target="_blank" rel="noreferrer" style={{ fontWeight: 600 }}>
                        {video.title}
                      </a>
                      <p style={{ color: "rgba(148,163,184,0.8)", fontSize: "0.85rem" }}>
                        {new Date(video.publishedAt).toLocaleString("en-IN", {
                          hour12: true,
                          timeZone: "Asia/Kolkata"
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
