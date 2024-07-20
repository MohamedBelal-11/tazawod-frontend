"use client";
import ArabicLayout from "@/app/components/arabicLayout";
import LoadingDiv from "@/app/components/loadingDiv";
import { arDay } from "@/app/utils/arabic";
import { get } from "@/app/utils/docQuery";
import globalClasses from "@/app/utils/globalClasses";
import { Weekday } from "@/app/utils/students";
import { useEffect, useState } from "react";

// decalare note type
interface Note {
  teacher: string;
  rate: number;
  discription: string | null;
  day: Weekday;
  date: string;
}

// declare response type
type Response =
  | {
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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setResponse({
      succes: true,
      notes: [
        {
          date: "11/3/2024",
          day: "sunday",
          discription: "fghg\nffff\nr",
          rate: 9,
          teacher: "محمد علي",
        },
        {
          date: "11/3/2024",
          day: "sunday",
          discription: "fghg\nffff\nr",
          rate: 9,
          teacher: "محمد علي",
        },
        {
          date: "11/3/2024",
          day: "sunday",
          discription: "fghg\nffff\nr",
          rate: 9,
          teacher: "محمد علي",
        },
        {
          date: "11/3/2024",
          day: "sunday",
          discription: "fghg\nffff\nr",
          rate: 9,
          teacher: "محمد علي",
        },
        {
          date: "11/3/2024",
          day: "sunday",
          discription: "fghg\nffff\nr",
          rate: 9,
          teacher: "محمد علي",
        },
      ],
      student: "محمد بلال",
    });
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (response && response.succes)
      get<HTMLTitleElement>(
        "title"
      )[0].innerHTML = `مذكرات الطالب ${response.student}`;
  }, [response]);

  return (
    <ArabicLayout>
      <LoadingDiv loading={!loaded} />
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
                        {`${arDay(note.day)}  ${note.date}`}
                      </p>
                      <p className="sm:text-2xl">
                        {note.rate}\
                        <span className="sm:text-lg text-sm">10</span>
                      </p>
                    </div>
                    <div className="p-4">
                      {note.discription
                        ? note.discription.split("\n").map((line, i) => (
                            <p key={i} className="sm:text-xl my-2">
                              {line.trim()}
                            </p>
                          ))
                        : "لم يتم كتابة تقرير"}
                    </div>
                    <p className="sm:text-2xl text-lg">
                      المعلم: {note.teacher}
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
    </ArabicLayout>
  );
};

export default Content;
