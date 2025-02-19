"use client";
import Copier from "@/app/components/copier";
import LoadingDiv from "@/app/components/loadingDiv";
import { fetchResponse } from "@/app/utils/response";
import { useEffect, useState } from "react";

type Responset =
  | {
      succes: true;
      name: string;
      email: string;
    }
  | {
      succes: false;
      error: number;
    }
  | null;

const Content: React.FC = () => {
  const [response, setResponse] = useState<Responset>();

  useEffect(() => {
    fetchResponse({
      setResponse,
      url: "/api/random-admin/",
    });
  }, []);

  if (response === undefined) {
    return <LoadingDiv loading />;
  }

  if (response === null) {
    return (
      <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
        حدث خطأٌ ما
      </div>
    );
  }

  if (!response.succes) {
    if (response.error === 5) {
      return (
        <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
          لا يوجد أي مشرفين بعد
        </div>
      );
    }
    return (
      <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
        حدث خطأٌ ما
      </div>
    );
  }

  return (
    <>
      <div className="h-px"></div>
      <div
        className="flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 140px)" }}
      >
        <div className="sm:p-6 p-2 m-6 flex-col gap-4 items-center justify-center bg-white">
          <p className="text-xl sm:text-3xl">الاسم: {response.name}</p>
          <p className="text-xl sm:text-3xl">
            البريد الإلكتروني:{" "}
            <a
              href={
                "mailto:" +
                response.email +
                "?subject=أود الإشتراك في أكاديمية تزود"
              }
              target="_blank"
              dir="ltr"
              className="hover:text-green-600 hover:underline"
            >
              {response.email}
            </a>
          </p>
          <Copier copy={response.email} arabic />
        </div>
      </div>
    </>
  );
};

export default Content;
