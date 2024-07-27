"use client";
import { useEffect, useState } from "react";
import arabicFooter from "./arabicFooter";
import ArabicNavBar from "./arabicNavBar";
import LoadingDiv from "./loadingDiv";

export default function ArabicLayout({
  children,
  style,
  className,
  head
}: {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  head?: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true)

  useEffect(() => setLoading(false), [])

  return (
    <html lang="ar">
      <head>
        <link
          rel="shortcut icon"
          href="/static/imgs/quran.png"
          type="image/PNG"
        />
        {head}
      </head>
      <body dir="rtl" style={style} className={className}>
        <ArabicNavBar />
        <div className="mt-20"></div>
        <LoadingDiv loading={loading} />
        {children}
        {arabicFooter}
      </body>
    </html>
  );
}
