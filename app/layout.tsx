import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Provider from "./providers";
import { Providers } from "@/store/provider";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "catmode.ai",
  description: "Authentication system with Next.js",
  icons: {
    icon: "/images/cat.png",
    apple: "/images/cat.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Provider>
            <Providers>{children}</Providers>
          </Provider>
        </Providers>
      </body>
    </html>
  );
}
