"use client";
import { useEffect, useState } from "react";
import AdminContent, { Admin } from "./admin";
import SuperadminContent, { Superadmin } from "./superadmin";
import LoadingDiv from "@/app/components/loadingDiv";
import { fetchResponse } from "@/app/utils/response";

type Responset =
  | Admin
  | Superadmin
  | {
      succes: false;
    }
  | null;

const Content: React.FC = () => {
  const [response, setResponse] = useState<Responset>();

  const refetch = () => {
    fetchResponse({
      setResponse,
      url: `/api/admin-acount/`,
    });
  };

  useEffect(() => {
    refetch();
  }, []);

  if (response === null) {
    return (
      <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
        حدث خطأٌ ما
      </div>
    );
  }


  if (response === undefined) {
    return <LoadingDiv loading />;
  }

  if (!response.succes) {
    return (
      <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
        حدث خطأٌ ما
      </div>
    );
  }

  if (response.user_type === "admin") {
    return <AdminContent user={response} refetch={refetch} />;
  }

  return <SuperadminContent user={response} refetch={refetch} />;
};

export default Content;
