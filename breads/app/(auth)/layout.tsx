import { ClerkProvider } from "@clerk/nextjs";
import {Inter} from "next/font/google";
import "../globals.css";

import React from "react";
import { dark } from "@clerk/themes";

export const metadata = {
    title: "Breads",
    description: "A Next.js 14 Meta Breads Application"
};

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider appearance={{
            baseTheme: dark,
        }}>
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}>
                    <div className="w-full flex justify-center items-center min-h-screen">
                        {children}
                    </div>
                </body>
            </html>
        </ClerkProvider>
    ) 
}