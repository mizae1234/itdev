import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AION Body & Paint Center — ข้อเสนอธุรกิจ 2026",
  description: "แดชบอร์ดการเงินแบบอินเทอร์แอคทีฟสำหรับข้อเสนอการลงทุน AION Body & Paint Center ศูนย์บริการซ่อมสีและตัวถังรถยนต์ EV",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
