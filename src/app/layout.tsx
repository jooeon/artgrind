import type { Metadata } from "next";
import "./globals.css";
import Cursor from "@/app/components/Cursor";
import DrawableBackground from "@/app/components/DrawableBackground";
import React from "react";
import {TransitionProvider} from "@/app/context/TransitionContext";

export const metadata: Metadata = {
    metadataBase: new URL("https://artgrind.art"),

    title: "Timed Drawing Practice with Pinterest | ArtGrind",

    description:
        "Practice drawing with timed reference sessions using your Pinterest boards. Customize drawing timers, choose your references, and build a consistent drawing practice.",

    alternates: {
        canonical: "/",
    },

    openGraph: {
        title: "Timed Drawing Practice with Pinterest | ArtGrind",
        description:
            "Practice drawing with timed reference sessions using your Pinterest boards.",
        url: "/",
        siteName: "ArtGrind",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "Timed Drawing Practice with Pinterest | ArtGrind",
        description:
            "Practice drawing with timed reference sessions using your Pinterest boards.",
    },

    icons: {
        icon: [
            {
                url: "/favicon/favicon-16x16.png",
                sizes: "16x16",
                type: "image/png",
            },
            {
                url: "/favicon/favicon-32x32.png",
                sizes: "32x32",
                type: "image/png",
            },
        ],
        apple: "/favicon/apple-touch-icon.png",
    },

    manifest: "/favicon/site.webmanifest",
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
            </head>
            <body className="bg-white font-neue-haas max-h-[100dvh]">
                <TransitionProvider>
                    <DrawableBackground />
                    <Cursor />
                    {children}
                </TransitionProvider>
            </body>
        </html>
    );
}