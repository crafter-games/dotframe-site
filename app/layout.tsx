import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Permanent_Marker } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});
const marker = Permanent_Marker({
  variable: "--font-marker",
  subsets: ["latin"],
  weight: "400",
});

const description =
  "A TypeScript game engine your agent can play. One codebase for the web, iPhone, macOS, Windows and Discord, deterministic down to the frame.";

export const metadata: Metadata = {
  metadataBase: new URL("https://dotframe.crafter.games"),
  title: "dotframe: the game engine your agent can play",
  description,
  openGraph: {
    title: "dotframe",
    description,
    url: "https://dotframe.crafter.games",
    siteName: "dotframe",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "dotframe", description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${jetbrains.variable} ${marker.variable} antialiased`}
    >
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
