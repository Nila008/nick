import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "NickEditz - Video Editing Portfolio",
  description: "Showcasing the best video editing projects with professional quality and creative vision.",
  keywords: ["video editing", "portfolio", "professional editor", "video production", "creative editing"],
  authors: [{ name: "NickEditz", url: "https://nickeditz.com" }],
  creator: "NickEditz",
  publisher: "NickEditz",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "NickEditz - Professional Video Editing Portfolio",
    description: "Explore creative video editing projects showcasing advanced techniques and professional quality.",
    url: "https://nickeditz.com",
    siteName: "NickEditz Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NickEditz - Professional Video Editing",
    description: "Creative video editing portfolio with advanced techniques and professional quality.",
    creator: "@nickeditz",
  },
  verification: {
    google: "your-google-verification-code",
  },
  applicationName: "NickEditz Portfolio",
  category: "Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
