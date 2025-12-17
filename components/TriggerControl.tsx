'use client';

import { useState, useTransition } from "react";
import { triggerAutomationFromDashboard } from "@/app/actions";

type TriggerState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success"; url: string; title: string }
  | { status: "error"; message: string };

export function TriggerControl() {
  const [state, setState] = useState<TriggerState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    setState({ status: "pending" });
    startTransition(async () => {
      try {
        const result = await triggerAutomationFromDashboard();
        setState({
          status: "success",
          url: result.youtubeUrl,
          title: result.title
        });
      } catch (error) {
        setState({
          status: "error",
          message: (error as Error).message ?? "Failed to run automation"
        });
      }
    });
  };

  return (
    <div className="card">
      <h2>Manual Launch</h2>
      <p style={{ color: "rgba(226, 232, 240, 0.8)", lineHeight: 1.6 }}>
        Trigger a full content generation cycle instantly. Use sparingly—each run generates brand
        new media assets, stitches a video, and publishes straight to your channel.
      </p>
      <button className="button" onClick={handleClick} disabled={isPending}>
        {isPending ? "Generating..." : "Launch Chaos Now"}
      </button>
      {state.status === "success" && (
        <p style={{ marginTop: 16, color: "#22c55e" }}>
          Uploaded <strong>{state.title}</strong>.{" "}
          <a href={state.url} target="_blank" rel="noreferrer">
            Watch on YouTube
          </a>
        </p>
      )}
      {state.status === "error" && (
        <p style={{ marginTop: 16, color: "#fca5a5" }}>{state.message}</p>
      )}
    </div>
  );
}
