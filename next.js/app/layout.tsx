import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Menu from './components/Menu';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RAGStack Demo App",
  description: "A RAGStack demonstrator on Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <Menu /> 
        {children}
      </body>
    </html>
  );
}
