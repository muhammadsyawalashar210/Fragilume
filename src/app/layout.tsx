import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AccentProvider } from "@/components/accent-provider";
import { LanguageProvider } from "@/components/language-provider";
import { accentNoFlashScript } from "@/lib/accent-presets";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fragilume — Note Studio for Author or Interest",
  description:
    "Aplikasi studio catatan untuk penulis novel, komik, plot film, dan game. Atur buku, plot, world building, dan wiki dalam satu studio.",
  keywords: [
    "fragilume",
    "note studio",
    "penulis novel",
    "komik",
    "plot film",
    "game writing",
    "world building",
  ],
  authors: [{ name: "Fragilume" }],
  icons: {
    icon: "/fragilume-logo.svg",
    apple: "/fragilume-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Script
          id="fragilume-accent-noflash"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: accentNoFlashScript }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AccentProvider>
            <LanguageProvider>
              {children}
              <Toaster />
            </LanguageProvider>
          </AccentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
