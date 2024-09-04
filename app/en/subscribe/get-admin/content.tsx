"use client";
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
        className="sm:p-4 p-1.5 flex-col gap-4 justify-center"
        style={{ minHeight: "calc(100vh - 140px)" }}
      >
        <p className="text-xl">{response.name}</p>
        <a
          href={
            "https://mail.google.com/mail/?view=cm&fs=1&to=" +
            response.email +
            "&su=أود+الإشتراك+في+أكاديمية+تزود&body="
          }
          target="_blank"
          dir="ltr"
          className="hover:text-green-600 hover:underline text-xl"
        >
          {response.email}
        </a>
      </div>
    </>
  );
};

export default Content;
