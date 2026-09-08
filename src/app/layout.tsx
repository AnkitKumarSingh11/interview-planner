import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Planly - Interview Preparation Tracker",
  description: "Plan, timeline, and track your interview preparation for Data Structures & Algorithms, Low Level Design, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
