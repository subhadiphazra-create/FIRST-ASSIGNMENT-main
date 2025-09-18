import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import AppSidebar from "@/components/main/AppSidebar";
import AppHeader from "@/components/main/AppHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Training App",
  description: "Training management system built with Next.js, Redux, shadcn",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="flex h-screen">
            {/* Sidebar */}
            <AppSidebar />

            {/* Main content area */}
            <div className="flex flex-col flex-1">
              <AppHeader />
              <main className="flex-1 p-4 flex flex-col w-full gap-4 overflow-x-auto">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
