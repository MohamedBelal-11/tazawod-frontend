import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Student Guide - Tazawad Academy",
};

const Page: React.FC = () => {
  return (
    <>
      <div className="h-px"></div>
      <main className="sm:m-12 m-4 sm:p-8 p-3 ps-8 rounded-lg bg-white">
        <ul className="*:list-disc flex-col gap-2">
          <li>Attend all appointments without delay.</li>
          <li>Make sure you select your correct gender before subscribing.</li>
          <li>If you miss a class, the platform is not responsible.</li>
          <li>Not talking to the teacher about outside lessons.</li>
        </ul>
      </main>
    </>
  );
};

export default Page;
