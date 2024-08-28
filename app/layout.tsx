import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  authors: {
    name: "Moahemd Belal",
    url: "https://www.linkedin.com/in/mohamedbelal11/",
  },
  applicationName: "Tazawad Academy",
  creator: "Moahemd Belal",
  title: "Tazawad Academy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
