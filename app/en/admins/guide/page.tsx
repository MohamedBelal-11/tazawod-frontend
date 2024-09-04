import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Admin's guide - Tazawad Academy",
};

const Page: React.FC = () => {
  return (
    <>
      <div className="h-px"></div>
      <main className="sm:m-12 m-4 sm:p-8 p-3 ps-8 rounded-lg bg-white">
        <ul className="*:list-disc flex-col gap-2">
          <li>
            Review meetings as they start every half hour and make sure they
            have started.
          </li>
          <li>Ensure that all enrolled students have a teacher.</li>
          <li>Review email and contact students who want to subscribe.</li>
        </ul>
      </main>
    </>
  );
};

export default Page;
