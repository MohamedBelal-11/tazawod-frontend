"use client";
import React, { useEffect, useState } from "react";
import englishFooter from "./englishFooter";
import EnglishNavBar from "./englishNavBar";
import LoadingDiv from "./loadingDiv";
import {
  LayoutContextProvider,
  useLayoutContext,
} from "../contexts/arabicLayoutContext";
import {
  ScrollContextProvider,
  useScrollContext,
} from "../contexts/scrollerContext";
import { stateScroll } from "../utils/docQuery";
import { usePathname } from "next/navigation";
import useHash from "../hooks/hash";

const Body: React.FC<{
  loading: boolean;
  children: React.ReactNode;
}> = ({ loading, children }) => {
  const [scrolled, setScrolled] = useState(false);
  const { layoutProperties } = useLayoutContext()!;
  const { scrollProperties } = useScrollContext()!;
  const [arms, setArms] = useState(true);
  const pathname = usePathname();
  const hash = useHash();
  useEffect(() => {
    setScrolled(false);
  }, [pathname, hash]);

  useEffect(() => {
    setArms(!pathname.startsWith("/en/auth"));
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
      {arms && (
        <>
          <EnglishNavBar />
          <div className="mt-20"></div>
        </>
      )}
      <LoadingDiv loading={loading} />
      {children}
      {arms && englishFooter}
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
    <html lang="en">
      <head>
        <link
          rel="shortcut icon"
          href="/static/imgs/quran.png"
          type="image/PNG"
        />
        <link rel="preload" href="/static/imgs/quran.gif" type="image/GIF" />
      </head>
      <LayoutContextProvider>
        <ScrollContextProvider>
          <Body loading={loading}>{children}</Body>
        </ScrollContextProvider>
      </LayoutContextProvider>
    </html>
  );
}
