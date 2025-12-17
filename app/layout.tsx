import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Animal Mayhem Automation",
  description: "Automated pipeline generating surreal animal videos and uploading to YouTube nightly."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
