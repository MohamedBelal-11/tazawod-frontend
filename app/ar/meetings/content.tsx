"use client"
import LoadingDiv from "@/app/components/loadingDiv";
import { useEffect, useState } from "react";
import TeacherContent from "./teacher";
import AdminContent from "./admin";

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
    setResponse({ succes: true, userType: "teacher" });
  }, []);

  if (response === undefined) {
    return <LoadingDiv loading />;
  }

  if (response === null) {
    return;
  }

  if (!response.succes) {
    return;
  }

  if (response.userType === "teacher") {
    return <TeacherContent />;
  }

  return <AdminContent isSuper={response.userType === "superadmin"} />;
};

export default Content;
