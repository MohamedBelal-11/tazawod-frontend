"use client";
import { useEffect, useState } from "react";
import Checker from "./Checker";
import { fetchPost, fetchResponse } from "../utils/response";

type Responset =
  | {
      succes: true;
      allown: boolean;
    }
  | {
      succes: false;
      error: number;
    }
  | null;

const AllowToSeenButton: React.FC<{ lang?: "en" | "ar" }> = ({
  lang = "ar",
}) => {
  const [response, setResponse] = useState<Responset>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResponse({setResponse, url: "/api/is-allowed-to-seen/"});
  }, []);

  let allown = false;
  if (response && response.succes) {
    allown = response.allown;
  }

  return (
    <div className="bg-white p-2 border-solid border-gray-800 border-4 rounded-md flex-col items-center fixed bottom-4 right-4 z-[5]">
      <p>
        {lang == "ar"
          ? "السماح للطلاب والمعلمين برؤيتك؟"
          : "Allowing students and teachers to see you"}
      </p>

      <Checker
        id="alowedtoseen"
        label=""
        type="switch"
        checked={allown}
        setChecked={
          response && response.succes && !loading
            ? (c) => {
                fetchPost({
                  setResponse: () => {},
                  data: { allown: c },
                  url: "/users/set-alow-to-seen/",
                  onFinish() {
                    fetchResponse({setResponse, url: "/api/is-allowed-to-seen/", setLoading});
                  },
                });
              }
            : undefined
        }
      />
    </div>
  );
};

export default AllowToSeenButton;
