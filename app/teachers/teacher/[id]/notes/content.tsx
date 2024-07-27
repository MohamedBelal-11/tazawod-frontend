"use client";
import ArabicLayout from "@/app/components/arabicLayout";
import Button from "@/app/components/button";
import Popup from "@/app/components/popup";
import { arDay } from "@/app/utils/arabic";
import { get } from "@/app/utils/docQuery";
import globalClasses from "@/app/utils/globalClasses";
import { objCompare } from "@/app/utils/object";
import { Weekday } from "@/app/utils/students";
import Link from "next/link";
import React, { useEffect, useState } from "react";
const inp =
  "p-2 text-lg border-2 border-gray-300 focus:border-sky-500 " +
  "rounded-lg border-solid max-w-96 w-full outline-0 shadow-3xl ";
// decalare note type
type Note =
  | {
      written: true;
      id: string;
      student: { name: string; id: string };
      rate: number;
      discription: string;
      day: Weekday;
      date: string;
    }
  | {
      written: false;
      id: string;
      student: { name: string; id: string };
      day: Weekday;
      date: string;
    };

// declare response type
type Response =
  | {
      userType: "admin" | "self";
      succes: true;
      notes: Note[];
      teacher: string;
    }
  | {
      succes: false;
      error: number;
    }
  | null;

const EditNote: React.FC<{ note: Note | undefined; onClose: () => void }> = ({
  note,
  onClose,
}) => {
  const [description, setDescription] = useState(
    note ? (note.written ? note.discription : "") : ""
  );
  const [rate, setRate] = useState<number | undefined>(
    note ? (note.written ? note.rate : undefined) : undefined
  );

  if (note === undefined) {
    return (
      <div
        style={{ height: "70vh", width: "90vw" }}
        className="flex justify-center items-center"
      >
        <p>حدث خطأ برجاء إعادة تحميل الصفحة</p>
      </div>
    );
  }

  return (
    <form
      className="h-full flex flex-col"
      onSubmit={(e) => e.preventDefault()}
      style={{ maxWidth: 800, maxHeight: "85vh", width: "calc(100vw - 40px)" }}
    >
      <div
        className="overflow-y-auto p-4 flex flex-col items-center h-full w-full"
        style={{ flexGrow: 1 }}
      >
        <p>التقييم</p>
        <div className="flex items-center">
          <input
            type="text"
            value={rate !== undefined ? rate : "-"}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (!Number.isNaN(value) && !(value > 10 || value < -10)) {
                setRate(value === 0 ? 0 : Math.abs(value));
              }
            }}
            placeholder="التقييم"
            className={inp}
            maxLength={2}
            required
            autoComplete="name"
          />
          <div className="flex flex-col">
            <button
              className={"border-2 border-gray-300 border-solid p-1 rounded-lg"}
              onClick={() =>
                setRate((r) => (r ? (r < 10 ? r + 1 : 10) : 10))
              }
            >
              ▲
            </button>
            <button
              className={"border-2 border-gray-300 border-solid p-1 rounded-lg"}
              onClick={() =>
                setRate((r) => (r ? (r > 1 ? r - 1 : 1) : 1))
              }
            >
              ▼
            </button>
          </div>
        </div>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          className={inp + "mt-4"}
          value={description}
          style={{ maxWidth: "none" }}
        ></textarea>
      </div>
      <div className="flex p-2 border-t-2 border-solid border-gray-600 justify-evenly">
        <Button color="red" className="cursor-pointer" onClick={onClose}>
          إلغاء
        </Button>
        {objCompare(
          { description: description.trim(), rate },
          {
            description: note.written ? note.discription : "",
            rate: note.written ? note.rate : undefined,
          }
        ) ||
        description.trim() === "" ||
        !rate ? (
          <Button color="gray" type="div" textHov="black">
            تعديل
          </Button>
        ) : (
          <Button color="green" type="submit">
            تعديل
          </Button>
        )}
      </div>
    </form>
  );
};
const Content = () => {
  const [response, setResponse] = useState<Response>();
  const [popup, setPopup] = useState<number>();

  useEffect(() => {
    setResponse({
      succes: true,
      userType: "self",
      notes: [
        {
          date: "11/3/2024",
          day: "sunday",
          id: "1",
          discription: "fghg\nffff\nr",
          rate: 9,
          written: true,
          student: { name: "محمد علي", id: "aaaa" },
        },
        {
          written: false,
          date: "11/3/2024",
          day: "sunday",
          id: "1",
          student: { name: "محمد علي", id: "aaaa" },
        },
        {
          date: "11/3/2024",
          day: "sunday",
          id: "1",
          discription: "fghg\nffff\nr",
          rate: 9,
          written: true,
          student: { name: "محمد علي", id: "aaaa" },
        },
        {
          date: "11/3/2024",
          day: "sunday",
          id: "1",
          written: false,
          student: { name: "محمد علي", id: "aaaa" },
        },
        {
          date: "11/3/2024",
          day: "sunday",
          id: "1",
          discription: "fghg\nffff\nr",
          rate: 9,
          written: true,
          student: { name: "محمد علي", id: "aaaa" },
        },
      ],
      teacher: "محمد بلال",
    });
  }, []);

  useEffect(() => {
    if (response && response.succes)
      get<HTMLTitleElement>(
        "title"
      )[0].innerHTML = `مذكرات المعلم ${response.teacher}`;
  }, [response]);

  return (
    <ArabicLayout>
      {response ? (
        response.succes ? (
          <>
            <main className="sm:p-6 p-2">
              <h1 className={globalClasses.sectionHeader}>
                مذكرات المعلم {response.teacher}
              </h1>
              <div className="rounded-3xl bg-white mt-8">
                {response.notes.length === 0 ? (
                  <div
                    className="h-full flex justify-center items-center"
                    style={{ minHeight: "60vh" }}
                  >
                    <p className="text-xl text-gray-600">
                      لا توجد أي مذكرات لهذا المعلم
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
                      {response.userType === "self" && (
                        <Button
                          color="sky"
                          textHov="black"
                          className="w-full mb-2"
                          onClick={() => setPopup(i)}
                        >
                          تعديل
                        </Button>
                      )}
                      <p className="sm:text-2xl text-lg">
                        الطالب:{" "}
                        {response.userType === "self" ? (
                          note.student.name
                        ) : (
                          <Link
                            href={`/students/student/${note.student.id}`}
                            className="hover:underline hover:text-green-500"
                          >
                            {note.student.name}
                          </Link>
                        )}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </main>
            <Popup
              visible={popup !== undefined}
              onClose={() => setPopup(undefined)}
            >
              {popup !== undefined && (
                <EditNote
                  onClose={() => setPopup(undefined)}
                  note={response.notes[popup!]}
                />
              )}
            </Popup>
          </>
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
