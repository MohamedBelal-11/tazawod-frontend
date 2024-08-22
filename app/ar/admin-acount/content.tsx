import { useState } from "react";
import AdminContent, { Admin } from "./admin";
import SuperadminContent, { Superadmin } from "./superadmin";
import LoadingDiv from "@/app/components/loadingDiv";

type Responset = Admin | Superadmin | null;

const Content: React.FC = () => {
  const [response, setResponse] = useState<Responset>();

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

  if (response.user_type === "admin") {
    return <AdminContent user={response} />;
  }

  return <SuperadminContent user={response} />;
};
