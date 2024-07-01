import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Comfortaa } from "next/font/google";
import { Gabarito } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/Providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

const comfortaa = Comfortaa({
  subsets: ["latin"],
  display: "swap",
});

const gabarito = Gabarito({
  subsets: ["latin"],
  display: "swap",
});

const fontHeading = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "X-Code",
  description: "A modern code editor for the web",
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
          "antialiased",
          inter.className,
          fontHeading.variable,
          fontBody.variable,
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
