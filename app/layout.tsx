import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Power Platform Architect Agent",
  description:
    "Turn natural language requirements into Microsoft Power Platform architecture blueprints with AI guidance grounded in Foundry IQ and best practices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
