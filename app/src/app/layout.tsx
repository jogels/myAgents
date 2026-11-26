import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyAgents HQ · AI Employees — Sales & Marketing",
  description: "Virtual 3D startup office for Sales & Marketing AI employee agents",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full w-full overflow-hidden antialiased`}
    >
      <body className="m-0 h-full w-full overflow-hidden bg-[#0b1019] p-0">
        {children}
      </body>
    </html>
  );
}
