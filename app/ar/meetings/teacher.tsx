"use client";
import LoadingDiv from "@/app/components/loadingDiv";
import { Date } from "@/app/utils/students";
import { useEffect, useState } from "react";

interface Meet extends Date {
  student: string;
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

const SuccesContent: React.FC<{ meetings: Meet[] }> = ({ meetings }) => {
  return (
    <div className="p-3">
      <main className="p-4 bg-white flex rounded-lg overflow-hidden">
        <button className="px-1">
          
        </button>
        <div className="flex-auto"></div>
      </main>
    </div>
  );
};

const TeacherContent: React.FC = () => {
  const [response, setResponse] = useState<Responset>();

  useEffect(() => {
    setResponse({ is_accepted: false });
  }, []);

  if (response === undefined) {
    return <LoadingDiv loading />;
  }

  if (response === null) {
    return;
  }

  if (!response.is_accepted) {
    return (
      <div className="p-4">
        <p className="p-6 bg-white rounded-lg text-gray-600">
          لم يتم الموافقة عليك بعد لذلك لا يوجد أي مقابلات
        </p>
      </div>
    );
  }

  return <SuccesContent meetings={response.meetings} />;
};

export default TeacherContent;
