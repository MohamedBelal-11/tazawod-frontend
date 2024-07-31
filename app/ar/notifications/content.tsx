"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Notificationt = {
  title: string;
  link: string;
  external: Boolean;
};

type Responset =
  | {
      succes: true;
      notifications: Notificationt[];
    }
  | {
      succes: false;
      error: number;
    }
  | null;

const Content: React.FC = () => {
  const [response, setResponse] = useState<Responset>();

  useEffect(() => {
    setResponse({succes: true, notifications: [
      {title: "", external: true, link: ""}
    ]})
  }, [])

  if (response === null) {
    return;
  }

  if (response && !response.succes) {
    return;
  }

  return (
    <div className="p-2">
      <main
        style={
          response === undefined ||
          (Boolean(response) && response?.notifications.length === 0)
            ? { minHeight: "calc(100vh - 110px)" }
            : undefined
        }
        className={
          "p-4 rounded-xl bg-white" +
          (response === undefined ||
          (Boolean(response) && response?.notifications.length === 0)
            ? " flex items-center justify-center"
            : "")
        }
      >
        {response === undefined ? (
          <div
            className={
              "border-solid border-gray-200 border-t-green-600 " +
              "w-24 h-24 animate-spin rounded-full"
            }
            style={{ borderWidth: "12px" }}
          ></div>
        ) : response.notifications.length === 0 ? (
          <p className="text-xl text-gray-400">لا يوجد أي إشعارات بعد</p>
        ) : (
          <></>
        )}
      </main>
    </div>
  );
};

export default Content;
