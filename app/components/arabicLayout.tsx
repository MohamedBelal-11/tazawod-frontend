"use client";
import ArabicNavBar from "./arabicNavBar";

export default function ArabicLayout({
  children,
  style,
  className,
}: {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <html lang="ar">
      <head>
        <link
          rel="shortcut icon"
          href="/static/imgs/quran.png"
          type="image/PNG"
        />
      </head>
      <body dir="rtl" style={style} className={className}>
        <ArabicNavBar />
        <div className="mt-20"></div>
        {children}
      </body>
    </html>
  );
}
