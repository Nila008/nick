import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1.5,
  userScalable: true,
  viewportFit: "cover",
  interactiveWidget: "resizes-visual",
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
        <Script id="viewport-height-fix" strategy="afterInteractive">
          {`
            // First we get the viewport height and we multiply it by 1% to get a value for a vh unit
            let vh = window.innerHeight * 0.01;
            // Then we set the value in the --vh custom property to the root of the document
            document.documentElement.style.setProperty('--vh', \`\${vh}px\`);
            
            // We listen to the resize event to update the --vh value when needed
            window.addEventListener('resize', () => {
              let vh = window.innerHeight * 0.01;
              document.documentElement.style.setProperty('--vh', \`\${vh}px\`);
            });
          `}
        </Script>
      </body>
    </html>
  );
}
