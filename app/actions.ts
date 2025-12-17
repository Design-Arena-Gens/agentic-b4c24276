"use server";

import { runAutomation } from "@/lib/automation";

export async function triggerAutomationFromDashboard() {
  const result = await runAutomation({ trigger: "dashboard-manual" });
  return result;
}
