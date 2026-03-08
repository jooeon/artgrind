import type { Metadata } from "next";
import "./globals.css";
import Cursor from "@/app/components/Cursor";
import DrawableBackground from "@/app/components/DrawableBackground";

export const metadata: Metadata = {
    title: "ArtGrind — Timed Drawing Practice with Pinterest",
    description: "Improve your drawing with timed practice sessions using your Pinterest boards. Set custom timers, track rounds, and build a daily art habit.",
    keywords: "timed drawing practice, Pinterest drawing, gesture drawing timer, art study tool",
    openGraph: {
        title: "ArtGrind — Timed Drawing Practice with Pinterest",
        description: "Timed drawing practice sessions using your Pinterest boards.",
        url: "https://artgrind.art",
        siteName: "ArtGrind",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "ArtGrind — Timed Drawing Practice with Pinterest",
        description: "Timed drawing practice sessions using your Pinterest boards.",
    },
    icons: {
        icon: [
            { url: "favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        ],
        apple: "favicon/apple-touch-icon.png",
        other: [
            { rel: "android-chrome", url: "favicon/android-chrome-192x192.png", sizes: "192x192" },
            { rel: "android-chrome", url: "favicon/android-chrome-512x512.png", sizes: "512x512" },
        ],
    },
    manifest: "favicon/site.webmanifest",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                {/*Adobe fonts*/}
                <link rel="stylesheet" href="https://use.typekit.net/vvo6xhh.css"/>
                <title>ArtGrind - Timed Drawing Practice</title>
            </head>
            <body className="bg-white font-neue-haas">
                <DrawableBackground />
                <Cursor />
                {children}
            </body>
        </html>
    );
}