"use client";
import { fetchResponse } from "@/app/utils/response";
import { bDate } from "@/app/utils/time";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Notificationt = {
  title: string;
  link: string;
  external: boolean;
  read: boolean;
  dateCreated: string;
};

type Responset =
  | {
      succes: true;
      notifications: Notificationt[];
      has_more: boolean;
    }
  | {
      succes: false;
      error: number;
    }
  | null;

const Content: React.FC = () => {
  const [response, setResponse] = useState<Responset>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    const query = new URLSearchParams({ page: "1" });
    fetchResponse({
      setResponse,
      url: "/api//notifications/",
      query: query.toString(),
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      Boolean(response && response.succes && response.has_more) &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, response]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (page !== 1) {
      const query = new URLSearchParams({ page: page.toString() });
      fetchResponse({
        setResponse,
        url: "/api/en/notifications/",
        query: query.toString(),
        setLoading,
      });
    }
  }, [page]);

  if (response === null) {
    return (
      <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
        Something went wrong.
      </div>
    );
  }

  if (response && !response.succes) {
    return (
      <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
        Something went wrong.
      </div>
    );
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
          <p className="text-xl text-gray-400">There are no notifications yet.</p>
        ) : (
          response.notifications.map(
            ({ link, external, read, title, dateCreated }, i) => (
              <Link
                href={external ? link : "/" + link}
                key={i}
                target={external ? "_blank" : undefined}
                className={
                  "rounded-xl p-5 flex justify-between sm:text-lg text-sm mb-4 last:mb-0 " +
                  (read ? "bg-slate-200" : "bg-sky-200")
                }
              >
                <span className="block">{title}</span>
                <span className="block text-md">
                  {bDate.getFormedDate(dateCreated, {
                    form: "english",
                    time: true,
                  })}
                </span>
              </Link>
            )
          )
        )}
      </main>
      {loading && (
        <div className="justify-center flex bg-white">
          <div
            className={
              "border-solid border-gray-200 border-t-green-600 " +
              "w-24 h-24 animate-spin rounded-full"
            }
            style={{ borderWidth: "12px" }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Content;
