"use client";
import LoadingDiv from "@/app/components/loadingDiv";
import { get } from "@/app/utils/docQuery";
import globalClasses from "@/app/utils/globalClasses";
import { StudentNoteAdmin } from "@/app/utils/note";
import { fetchResponse } from "@/app/utils/response";
import { bDate } from "@/app/utils/time";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// declare response type
type Response =
  | {
      userType: "admin" | "self";
      succes: true;
      notes: StudentNoteAdmin[];
      has_more: boolean;
      student: string;
    }
  | {
      succes: false;
      error: number;
    }
  | null;

const Content = () => {
  const { id }: { id: string } = useParams();
  const [response, setResponse] = useState<Response>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    const query = new URLSearchParams({ page: "1" });
    fetchResponse({
      setResponse,
      url: `/api/student/${id}/notes/`,
      query: query.toString(),
    });
  }, [id]);

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
        url: `/api/student/${id}/notes/`,
        query: query.toString(),
        setLoading,
      });
    }
  }, [page, id]);

  useEffect(() => {
    if (response && response.succes)
      get<HTMLTitleElement>(
        "title"
      )[0].innerHTML = `مذكرات الطالب ${response.student}`;
    if (response && response.succes) console.log(response.notes[0].date);
  }, [response]);

  return (
    <>
      {response === undefined ? (
        <LoadingDiv loading />
      ) : response === null ? (
        <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
          حدث خطأٌ ما
        </div>
      ) : response.succes ? (
        <main className="sm:p-6 p-2">
          <h1 className={globalClasses.sectionHeader}>
            مذكرات الطالب {response.student}
          </h1>
          <div className="rounded-3xl bg-white mt-8">
            {response.notes.length === 0 ? (
              <div
                className="h-full flex justify-center items-center"
                style={{ minHeight: "60vh" }}
              >
                <p className="text-xl text-gray-600">
                  لا توجد أي مذكرات لهذا الطالب
                </p>
              </div>
            ) : (
              response.notes.map((note, i) => (
                <div
                  key={i}
                  className={
                    "border-gray-600 border-b-2 border-solid " +
                    "last:border-b-0 sm:p-8 p-4"
                  }
                >
                  <div className="flex justify-between">
                    <p className="sm:text-2xl">
                      {bDate.getFormedDate(note.date, { form: "arabic" })}
                    </p>
                    <p className="sm:text-2xl">
                      {note.written ? note.rate : "-"}\
                      <span className="sm:text-lg text-sm">10</span>
                    </p>
                  </div>
                  <div className="p-4">
                    {note.written
                      ? note.description.split("\n").map((line, i) => (
                          <p key={i} className="sm:text-xl my-2">
                            {line.trim()}
                          </p>
                        ))
                      : "لم يتم كتابة المذكرة"}
                  </div>
                  <p className="sm:text-2xl text-lg">
                    المعلم:{" "}
                    {response.userType === "self" ? (
                      note.teacher.name
                    ) : (
                      <Link
                        href={`/ar/teachers/teacher/${note.teacher.id}`}
                        className="hover:underline hover:text-green-500"
                      >
                        {note.teacher.name}
                      </Link>
                    )}
                  </p>
                </div>
              ))
            )}
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
        </main>
      ) : (
        <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
          حدث خطأٌ ما
        </div>
      )}
    </>
  );
};

export default Content;
