"use client";
import arabicFooter from "./arabicFooter";
import ArabicNavBar from "./arabicNavBar";

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
        {children}
        {arabicFooter}
      </body>
    </html>
  );
}
