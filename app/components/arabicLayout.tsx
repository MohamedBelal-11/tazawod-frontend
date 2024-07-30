"use client";
import { useEffect, useState } from "react";
import arabicFooter from "./arabicFooter";
import ArabicNavBar from "./arabicNavBar";
import LoadingDiv from "./loadingDiv";

export default function ArabicLayout({
  children,
  style,
  className,
  head,
}: {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  head?: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [arms, setArms] = useState(true);

  useEffect(() => {
    setLoading(false);
    if (location.pathname.startsWith("/ar/auth")) {
      setArms(false);
    }
  }, []);

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
        <span className="hidden bg-yellow-200 hover:bg-yellow-500 border-yellow-500 bg-amber-200 hover:bg-amber-500 border-amber-500"></span>
        {arms && <ArabicNavBar />}
        <div className="mt-20"></div>
        <LoadingDiv loading={loading} />
        {children}
        {arms && arabicFooter}
      </body>
    </html>
  );
}
