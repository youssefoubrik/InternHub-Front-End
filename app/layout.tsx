"use client";

import "@/app/globals.css";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ContextProvider from "@/providers/ContextProvider";
import { BlockedUserCheck } from "@/components/BlockedUserCheck";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
                    integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                />
            </head>
            <body style={{ fontFamily: "Poppins , sans-serif" }}>
                <Toaster
                    position="top-center"
                    toastOptions={{
                        style: { maxWidth: "650px" },
                    }}
                />

                <ContextProvider>
                    <Header />
                    <BlockedUserCheck>
                        {children}
                    </BlockedUserCheck>
                    <Footer />
                </ContextProvider>
            </body>
        </html>
    );
}
