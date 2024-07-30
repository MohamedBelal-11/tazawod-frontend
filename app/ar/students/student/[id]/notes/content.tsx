"use client";
import {  getArabicDate } from "@/app/utils/arabic";
import { get } from "@/app/utils/docQuery";
import globalClasses from "@/app/utils/globalClasses";
import Link from "next/link";
import { useEffect, useState } from "react";

// decalare note type
type Note =
  | {
      written: true;
      teacher: { name: string; id: string };
      rate: number;
      discription: string;
      date: string;
    }
  | {
      written: false;
      teacher: { name: string; id: string };
      date: string;
    };

// declare response type
type Response =
  | {
      userType: "admin" | "self";
      succes: true;
      notes: Note[];
      student: string;
    }
  | {
      succes: false;
      error: number;
    }
  | null;

const Content = () => {
  const [response, setResponse] = useState<Response>();

  useEffect(() => {
    setResponse({
      succes: true,
      userType: "self",
      notes: [
        {
          date: "11/3/2024",
          discription: "fghg\nffff\nr",
          rate: 9,
          written: true,
          teacher: { name: "محمد علي", id: "aaaa" },
        },
        {
          written: false,
          date: "11/3/2024",
          teacher: { name: "محمد علي", id: "aaaa" },
        },
        {
          date: "11/3/2024",
          discription: "fghg\nffff\nr",
          rate: 9,
          written: true,
          teacher: { name: "محمد علي", id: "aaaa" },
        },
        {
          date: "11/3/2024",
          written: false,
          teacher: { name: "محمد علي", id: "aaaa" },
        },
        {
          date: "11/3/2024",
          discription: "fghg\nffff\nr",
          rate: 9,
          written: true,
          teacher: { name: "محمد علي", id: "aaaa" },
        },
      ],
      student: "محمد بلال",
    });
  }, []);

  useEffect(() => {
    if (response && response.succes)
      get<HTMLTitleElement>(
        "title"
      )[0].innerHTML = `مذكرات الطالب ${response.student}`;
  }, [response]);

  return (
    <>
      {response ? (
        response.succes ? (
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
                        {getArabicDate(note.date)}
                      </p>
                      <p className="sm:text-2xl">
                        {note.written ? note.rate : "-"}\
                        <span className="sm:text-lg text-sm">10</span>
                      </p>
                    </div>
                    <div className="p-4">
                      {note.written
                        ? note.discription.split("\n").map((line, i) => (
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
                          href={`/teachers/teacher/${note.teacher.id}`}
                          className="hover:underline hover:text-green-500"
                        >
                          {note.teacher.name}
                        </Link>
                      )}
                    </p>
                  </div>
                ))
              )}
            </div>
          </main>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </>
  );
};

export default Content;
