import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio - Full Stack Developer",
  description: "Professional portfolio showcasing full-stack development projects and skills. Built with Next.js, TypeScript, and modern web technologies.",
  keywords: ["portfolio", "full-stack developer", "Next.js", "TypeScript", "React", "web development"],
  authors: [{ name: "Full Stack Developer" }],
  openGraph: {
    title: "Portfolio - Full Stack Developer",
    description: "Professional portfolio showcasing full-stack development projects and skills",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio - Full Stack Developer",
    description: "Professional portfolio showcasing full-stack development projects and skills",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
