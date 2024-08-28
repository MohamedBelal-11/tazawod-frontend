"use client";
import React, { useEffect, useState } from "react";
import arabicFooter from "./arabicFooter";
import ArabicNavBar from "./arabicNavBar";
import LoadingDiv from "./loadingDiv";
import {
  ArabicLayoutContextProvider,
  useArabicLayoutContext,
} from "../contexts/arabicLayoutContext";
import {
  ScrollContextProvider,
  useScrollContext,
} from "../contexts/scrollerContext";
import { stateScroll } from "../utils/docQuery";
import { usePathname } from "next/navigation";
import useHash from "../hooks/hash";
import { fetchResponse } from "../utils/response";

const markAllAsRead = () => {
  fetchResponse({ setResponse: () => undefined, url: "/users/read-all/" });
};

const activateclass =
  "hidden bg-yellow-200 hover:bg-yellow-500 border-yellow-500 " +
  "bg-emerald-200 hover:bg-emerald-500 border-emerald-500 bg-red-300 " +
  "bg-amber-200 hover:bg-amber-500 border-amber-500 bg-green-300";
const Body: React.FC<{
  loading: boolean;
  children: React.ReactNode;
}> = ({ loading, children }) => {
  const [scrolled, setScrolled] = useState(false);
  const { layoutProperties } = useArabicLayoutContext()!;
  const { scrollProperties } = useScrollContext()!;
  const [arms, setArms] = useState(true);
  const pathname = usePathname();
  const [inNotifications, setInNotifications] = useState(false);
  const hash = useHash();
  useEffect(() => {
    setScrolled(false);
  }, [pathname, hash]);

  useEffect(() => {
    setArms(!pathname.startsWith("/ar/auth"));
    if (pathname.endsWith("notifications")) {
      setInNotifications(true);
    } else {
      if (inNotifications) {
        markAllAsRead();
        setInNotifications(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(
    () => stateScroll(scrolled, setScrolled),
    [scrollProperties, scrolled]
  );

  return (
    <body
      dir="rtl"
      style={layoutProperties.style}
      className={
        layoutProperties.className + (loading ? " overflow-y-hidden" : "")
      }
    >
      <span className={activateclass}></span>
      {arms && (
        <>
          <ArabicNavBar />
          <div className="mt-20"></div>
        </>
      )}
      <LoadingDiv loading={loading} />
      {children}
      {arms && arabicFooter}
    </body>
  );
};

export default function ArabicLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => setLoading(false), []);

  return (
    <html lang="ar">
      <head>
        <link
          rel="shortcut icon"
          href="/static/imgs/quran.png"
          type="image/PNG"
        />
        <link rel="preload" href="/static/imgs/quran.gif" type="image/GIF" />
      </head>
      <ArabicLayoutContextProvider>
        <ScrollContextProvider>
          <Body loading={loading}>{children}</Body>
        </ScrollContextProvider>
      </ArabicLayoutContextProvider>
    </html>
  );
}
