"use client";

export default function ArabicFormLayout({
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
        {children}
      </body>
    </html>
  );
}
