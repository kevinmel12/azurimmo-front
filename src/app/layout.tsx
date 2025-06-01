import '@ant-design/v5-patch-for-react-19';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Layout} from "antd";
import {Content, Header} from "antd/lib/layout/layout";


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Azurimmo - Gestion Immobilière",
    description: "Application de gestion immobilière",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <Layout style={{ minHeight: '100vh' }}>
            <Header>
                <h1 className={"text-white"}>Azurimmo</h1>
            </Header>
            <Content className={"p-8"} style={{ flex: 1 }}>
                {children}
            </Content>
            {/* ✅ Footer supprimé ! */}
        </Layout>
        </body>
        </html>
    );
}