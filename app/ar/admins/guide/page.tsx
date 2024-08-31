import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "دليل المشرف - أكاديمية تزود",
};

const Page: React.FC = () => {
  return (
    <>
      <div className="h-px"></div>
      <main className="sm:m-12 m-4 sm:p-8 p-3 ps-8 rounded-lg bg-white">
        <ul className="*:list-disc flex-col gap-2">
          <li>مراجعة مقابلات عند بدأها كل نصف ساعة والتأكد من أنها بدأت.</li>
          <li>التأكد من أن جميع الطلاب المشتركين لديهم معلم.</li>
          <li>
            مراجعة البريد الإلكتروني والتواصل مع الطلبة الذين يريدون الإشتراك
          </li>
        </ul>
      </main>
    </>
  );
};

export default Page;
