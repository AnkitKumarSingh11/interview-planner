import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

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
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('planly_theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased bg-[var(--background)] text-[var(--foreground)] selection:bg-teal-500 selection:text-white transition-colors duration-200">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
