import "./globals.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono } from "next/font/google";
import { APP_CONFIG_PUBLIC } from "@/config/config.public";
import { ThemeProvider } from "@/providers/theme-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_CONFIG_PUBLIC.APP_NAME}`,
    default: APP_CONFIG_PUBLIC.APP_NAME,
  },
  description: APP_CONFIG_PUBLIC.APP_DESCRIPTION,
  openGraph: {
    type: "website",
    url: APP_CONFIG_PUBLIC.APP_URL,
    title: APP_CONFIG_PUBLIC.APP_NAME,
    description: APP_CONFIG_PUBLIC.APP_DESCRIPTION,
    siteName: APP_CONFIG_PUBLIC.APP_NAME,
    images: [
      {
        url: APP_CONFIG_PUBLIC.APP_OG_IMAGE,
        alt: APP_CONFIG_PUBLIC.APP_NAME,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-svh bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader />
          <div className="relative flex min-h-svh flex-col bg-background">
            {children}
          </div>
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
