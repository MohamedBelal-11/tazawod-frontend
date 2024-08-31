import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "دليل الطالب - أكاديمية تزود",
};

const Page: React.FC = () => {
  return (
    <>
      <div className="h-px"></div>
      <main className="sm:m-12 m-4 sm:p-8 p-3 ps-8 rounded-lg bg-white">
        <ul className="*:list-disc flex-col gap-2">
          <li>حضور كل المواعيد دون تأخير.</li>
          <li>تأكد من إختيار جنسك الصحيح قبل الإشتراك</li>
          <li>إذا تغيبت عن حصة فالمنصة غير مسئولة.</li>
          <li>عدم التحدث مع المعلم بشأن دروس خارجية.</li>
        </ul>
      </main>
    </>
  );
};

export default Page;
