"use client"
import LoadingDiv from "@/app/components/loadingDiv";
import { useEffect, useState } from "react";
import TeacherContent from "./teacher";
import AdminContent from "./admin";
import { fetchResponse } from "@/app/utils/response";

type Responset =
  | {
      succes: true;
      userType: "admin" | "superadmin" | "teacher";
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
      url: "/api/check-user/"
    })
  }, [])

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
    return (
      <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
        حدث خطأٌ ما
      </div>
    );
  }

  if (response.userType === "teacher") {
    return <TeacherContent />;
  }

  return <AdminContent />;
};

export default Content;
