"use client"
import { useEffect, useState } from "react";
import ArabicNavBar from "./arabicNavBar";

export default function ArabicLayout({children}: {children?: React.ReactNode}) {
  return (
    <html lang="ar">
      <head>
        <link rel="shortcut icon" href="/static/imgs/quran.png" type="image/PNG" />
      </head>
      <body dir="rtl">
        <ArabicNavBar />
        <div className="mt-24"></div>
        {children}
      </body>
    </html>
  )
}