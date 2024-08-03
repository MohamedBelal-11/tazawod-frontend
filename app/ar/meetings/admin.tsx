"use client";
import LoadingDiv from "@/app/components/loadingDiv";
import { useState } from "react";

interface Meet {
  status: "didnt_start" | "didnt_checked" | "checked";
}

type Responset =
  | {
      is_accepted: true;
      meetings: Meet[];
    }
  | {
      is_accepted: false;
    }
  | null;

const AdminContent: React.FC<{ isSuper: boolean }> = ({ isSuper }) => {
  const [response, setResponse] = useState<Responset>();

  if (response === undefined) {
    return <LoadingDiv loading />;
  }

  if (response === null) {
    return <></>;
  }

  if (!response.is_accepted) {
  }

  if (!response.is_accepted) {
    return (
      <div className="p-4">
        <p className="p-6 bg-white rounded-lg text-gray-600">
          لم يتم الموافقة عليك بعد لذلك لا يمكنك دخول هذه الصفحة بعد
        </p>
      </div>
    );
  }

  return <></>;
};

export default AdminContent;
