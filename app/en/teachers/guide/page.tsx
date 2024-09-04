import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "دليل المعلم - أكاديمية تزود",
};

const Page: React.FC = () => {
  return (
    <>
      <div className="h-px"></div>
      <main className="sm:m-12 m-3 sm:p-8 p-1.5 ps-8 rounded-lg bg-white">
        <ul className="*:list-disc flex-col gap-2">
          <li>يجب على المعلم أن يحضر كل المواعيد دون تأخير.</li>
          <li>إذا أراد المعلم التغيب فعليه الإبلاغ بذلك أولًا.</li>
          <li>
            يجب على المعلم ان يتابع المنصة بتكرار كي يعرف تحديثات جدوله و أخرى
          </li>
          <li>
            عدم التحدث مع الطاب بشأن دروس خارجية
          </li>
        </ul>
      </main>
    </>
  );
};

export default Page;
