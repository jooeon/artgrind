import type { Metadata } from "next";
import "./globals.css";
import Cursor from "@/app/components/Cursor";
import DrawableBackground from "@/app/components/DrawableBackground";

export const metadata: Metadata = {
    description: "Created by Joo Eon Park©",
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
            <body className="font-neue-haas">
                <DrawableBackground />
                <Cursor />
                {children}
            </body>
        </html>
    );
}