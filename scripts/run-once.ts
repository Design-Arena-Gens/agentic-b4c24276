import { runAutomation } from "@/lib/automation";

async function main() {
  try {
    console.info("🚀 Starting animal mayhem pipeline…");
    const result = await runAutomation({ trigger: "cli-run" });
    console.info("✅ Uploaded:", result.youtubeUrl);
  } catch (error) {
    console.error("💥 Automation failed:", error);
    process.exitCode = 1;
  }
}

main();
