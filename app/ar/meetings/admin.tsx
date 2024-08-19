"use client";
import LoadingDiv from "@/app/components/loadingDiv";
import { useEffect, useState } from "react";
import { classes } from "./teacher";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import ScrollTopButton from "@/app/components/scrollTopButton";
import Checker from "@/app/components/Checker";
import { motion, Variants } from "framer-motion";
import { convertEgyptTimeToLocalTime } from "@/app/utils/time";
import Popup from "@/app/components/popup";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { numList } from "@/app/utils/string";
import Button, { getClass } from "@/app/components/button";
import Link from "next/link";

type Status = "didnt_start" | "didnt_checked" | "checked";

const embValue = <T = any,>(value: T, arr: T[]) => {
  if (!arr.includes(value)) {
    return [...arr, value];
  }
  if (arr.length === 1){
    return arr
  }
  return arr.filter((v) => v !== value);
};

interface User {
  name: string;
  phone: string;
  id: string;
}

type Meet =
  | {
      status: "didnt_start";
      teacher: User | null;
      student: User;
      id: number;
      started: string;
      ends: string;
    }
  | {
      status: "didnt_checked" | "checked";
      teacher: User;
      student: User;
      id: number;
      meet_link: string;
      started: string;
      ends: string;
    };

const parentVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const childVariants: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: { transition: { type: "spring", stiffness: 200 }, opacity: 1, x: 0 },
};

type Responset =
  | {
      is_accepted: true;
      meetings: Meet[];
    }
  | {
      is_accepted: false;
    }
  | null;

interface Filters {
  studentName: string;
  teacherName: string;
  studentPhone: string;
  teacherPhone: string;
  status: Status[];
}

const SuccesContent: React.FC<{ meetings: Meet[] }> = ({ meetings }) => {
  const [filterOpened, setFilterOpened] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    studentName: "",
    teacherName: "",
    studentPhone: "",
    teacherPhone: "",
    status: ["didnt_start", "didnt_checked", "checked"],
  });
  const [popup, setPopup] = useState<number>();

  return (
    <>
      <Popup onClose={() => setPopup(undefined)} visible={popup !== undefined}>
        {(() => {
          if (popup === undefined) {
            return;
          }
          const meeting = meetings[popup];
          return (
            <>
              <button
                style={{ zIndex: 1 }}
                className={
                  "absolute top-4 bg-white right-4 p-2 rounded-full " +
                  "border-2 border-gray-600 hover:bg-gray-300 transition-all duration-300"
                }
                onClick={() => setPopup(undefined)}
              >
                <XMarkIcon width={20} />
              </button>
              <div
                style={{ maxHeight: "calc(80vh - 110px)" }}
                className="w-screen p-4 overflow-y-auto max-w-3xl"
              >
                <div className="h-12"></div>
                <Link
                  href={`/ar/students/student/${meeting.student.id}`}
                  className="text-xl mb-4 text-green-500 hover:underline block"
                >
                  الطالب: {meeting.student.name}
                </Link>
                <p className="text-xl mb-4">الهاتف: {meeting.student.phone}</p>
                {meeting.teacher ? (
                  <>
                    <Link
                      href={`/ar/teachers/teacher/${meeting.teacher.id}`}
                      className="text-xl mb-4 text-green-500 hover:underline block"
                    >
                      المعلم: {meeting.teacher.name}
                    </Link>
                    <p className="text-xl mb-4">
                      الهاتف: {meeting.teacher.phone}
                    </p>
                  </>
                ) : (
                  <p className="text-xl mb-4 text-red-500">لا يوجد معلم</p>
                )}

                <p
                  className={
                    (meeting.status === "didnt_start"
                      ? "text-red-500"
                      : meeting.status === "didnt_checked"
                      ? "text-amber-500"
                      : "text-green-500") + " text-xl font-bold mb-4"
                  }
                >
                  {meeting.status === "didnt_start"
                    ? "لم يقم المعلم بإدخال الرابط"
                    : meeting.status === "didnt_checked"
                    ? "لم يتم التحقق منه"
                    : "تم التحقق منه"}
                </p>
                {meeting.status !== "didnt_start" ? (
                  <div className="flex justify-evenly">
                    <a
                      href={meeting.meet_link}
                      className={getClass({ color: "sky" }) + ""}
                    >
                      دخول المقابلة
                    </a>
                    {meeting.status === "didnt_checked" ? (
                      <Button color="green">تَأكدتُ من جريان المقابلة</Button>
                    ) : (
                      <Button color="red">هناك خطأ في الرابط</Button>
                    )}
                  </div>
                ) : undefined}
              </div>
            </>
          );
        })()}
      </Popup>
      <div className="p-3">
        <main
          className="bg-white flex rounded-lg overflow-hidden"
          style={{ minHeight: "calc(100vh - 140px)" }}
        >
          <div
            className={`transition-all duration-500 overflow-hidden ${
              filterOpened ? "sm:w-64 w-40 flex-none" : "w-0"
            }`}
          >
            <div className="p-4">
              <input
                placeholder="اسم الطالب"
                type="text"
                className={classes["inp"]}
                value={filters.studentName}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, studentName: e.target.value }))
                }
              />
              <input
                placeholder="اسم المعلم"
                type="text"
                className={classes["inp"]}
                value={filters.teacherName}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, teacherName: e.target.value }))
                }
              />
              <input
                placeholder="هاتف الطالب"
                type="text"
                className={classes["inp"]}
                value={filters.studentPhone}
                onChange={(e) => {
                  const value = e.target.value;
                  let alive = true;
                  for (const c of value) {
                    if (!numList.includes(c)) {
                      alive = false;
                      break;
                    }
                  }
                  if (alive) {
                    setFilters((f) => ({ ...f, studentPhone: e.target.value }));
                  }
                }}
              />
              <input
                placeholder="هاتف المعلم"
                type="text"
                className={classes["inp"]}
                value={filters.teacherPhone}
                onChange={(e) => {
                  const value = e.target.value;
                  let alive = true;
                  for (const c of value) {
                    if (!numList.includes(c)) {
                      alive = false;
                      break;
                    }
                  }
                  if (alive) {
                    setFilters((f) => ({ ...f, teacherPhone: e.target.value }));
                  }
                }}
              />
              <div className="mt-4">
                <Checker
                  id="didnt_start"
                  label="لم يقم المعلم بإدخال الرابط"
                  type="checkbox"
                  checked={filters.status.includes("didnt_start")}
                  onChange={() => {
                    setFilters((f) => ({
                      ...f,
                      status: embValue("didnt_start", f.status),
                    }));
                  }}
                />
                <Checker
                  id="didnt_checked"
                  label="لم يتم التحقق منه"
                  type="checkbox"
                  checked={filters.status.includes("didnt_checked")}
                  onChange={() => {
                    setFilters((f) => ({
                      ...f,
                      status: embValue("didnt_checked", f.status),
                    }));
                  }}
                />
                <Checker
                  id="checked"
                  label="تم التحقق منه"
                  type="checkbox"
                  checked={filters.status.includes("checked")}
                  onChange={() => {
                    setFilters((f) => ({
                      ...f,
                      status: embValue("checked", f.status),
                    }));
                  }}
                />
              </div>
            </div>
          </div>
          <div
            className="px-1 border-x-2 border-gray-500 cursor-pointer"
            onClick={() => setFilterOpened((o) => !o)}
          >
            <ChevronDoubleLeftIcon
              className={
                "transition-all duration-500 top-24" +
                (filterOpened ? " rotate-180" : "")
              }
              width={20}
            />
          </div>
          <motion.div
            variants={parentVariants}
            initial="hidden"
            animate="visible"
            className="flex-auto p-4 flex gap-4 justify-evenly flex-wrap"
          >
            {meetings.map((meeting, i) => (
              <motion.div
                key={i}
                className="p-4 border-2 border-gray-700 cursor-pointer rounded-lg *:mb-3 w-64"
                onClick={() => setPopup(i)}
                variants={childVariants}
              >
                {meeting.teacher ? (
                  <p>
                    درس الطالب {meeting.student.name} مع المعلم{" "}
                    {meeting.teacher.name}
                  </p>
                ) : (
                  <p>لا يوجد معلم للطالب {meeting.student.name}</p>
                )}
                <p
                  className={
                    (meeting.status === "didnt_start"
                      ? "text-red-500"
                      : meeting.status === "didnt_checked"
                      ? "text-amber-500"
                      : "text-green-500") + " font-bold"
                  }
                >
                  {meeting.status === "didnt_start"
                    ? "لم يقم المعلم بإدخال الرابط"
                    : meeting.status === "didnt_checked"
                    ? "لم يتم التحقق منه"
                    : "تم التحقق منه"}
                </p>
                <p>بدء {convertEgyptTimeToLocalTime(meeting.started)}</p>
                <p className="mb-0">
                  ينتهي {convertEgyptTimeToLocalTime(meeting.ends)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </main>
      </div>
      <ScrollTopButton />
    </>
  );
};

const AdminContent: React.FC<{ isSuper: boolean }> = ({ isSuper }) => {
  const [response, setResponse] = useState<Responset>();

  useEffect(() => {
    setResponse({
      is_accepted: true,
      meetings: [
        {
          id: 1,
          status: "didnt_start",
          student: {
            name: "محمد بلال",
            phone: "201283410254",
            id: "abcd-efgh-ijkl-mnop",
          },
          teacher: null,
          started: "02:00",
          ends: "03:00",
        },
        {
          id: 1,
          meet_link: "https://google.meet.com/fedrfgrgr",
          status: "didnt_checked",
          student: {
            name: "محمد بلال",
            phone: "201283410254",
            id: "abcd-efgh-ijkl-mnop",
          },
          teacher: {
            name: "محمد علي",
            phone: "201234567890",
            id: "abcd-efgh-ijkl-mnop",
          },
          started: "02:00",
          ends: "03:00",
        },
        {
          id: 1,
          meet_link: "https://google.meet.com/fedrfgrgr",
          status: "didnt_checked",
          student: {
            name: "محمد بلال",
            phone: "201283410254",
            id: "abcd-efgh-ijkl-mnop",
          },
          teacher: {
            name: "محمد علي",
            phone: "201234567890",
            id: "abcd-efgh-ijkl-mnop",
          },
          started: "02:00",
          ends: "03:00",
        },
        {
          id: 1,
          meet_link: "https://google.meet.com/fedrfgrgr",
          status: "checked",
          student: {
            name: "محمد بلال",
            phone: "201283410254",
            id: "abcd-efgh-ijkl-mnop",
          },
          teacher: {
            name: "محمد علي",
            phone: "201234567890",
            id: "abcd-efgh-ijkl-mnop",
          },
          started: "02:00",
          ends: "03:00",
        },
        {
          id: 1,
          status: "didnt_start",
          student: {
            name: "محمد بلال",
            phone: "201283410254",
            id: "abcd-efgh-ijkl-mnop",
          },
          teacher: {
            name: "محمد علي",
            phone: "201234567890",
            id: "abcd-efgh-ijkl-mnop",
          },
          started: "02:00",
          ends: "03:00",
        },
        {
          id: 1,
          meet_link: "https://google.meet.com/fedrfgrgr",
          status: "checked",
          student: {
            name: "محمد بلال",
            phone: "201283410254",
            id: "abcd-efgh-ijkl-mnop",
          },
          teacher: {
            name: "محمد علي",
            phone: "201234567890",
            id: "abcd-efgh-ijkl-mnop",
          },
          started: "02:00",
          ends: "03:00",
        },

        {
          id: 1,
          status: "didnt_start",
          student: {
            name: "محمد بلال",
            phone: "201283410254",
            id: "abcd-efgh-ijkl-mnop",
          },
          teacher: {
            name: "محمد علي",
            phone: "201234567890",
            id: "abcd-efgh-ijkl-mnop",
          },
          started: "02:00",
          ends: "03:00",
        },
        {
          id: 1,
          meet_link: "https://google.meet.com/fedrfgrgr",
          status: "didnt_checked",
          student: {
            name: "محمد بلال",
            phone: "201283410254",
            id: "abcd-efgh-ijkl-mnop",
          },
          teacher: {
            name: "محمد علي",
            phone: "201234567890",
            id: "abcd-efgh-ijkl-mnop",
          },
          started: "02:00",
          ends: "03:00",
        },
        {
          id: 1,
          meet_link: "https://google.meet.com/fedrfgrgr",
          status: "didnt_checked",
          student: {
            name: "محمد بلال",
            phone: "201283410254",
            id: "abcd-efgh-ijkl-mnop",
          },
          teacher: {
            name: "محمد علي",
            phone: "201234567890",
            id: "abcd-efgh-ijkl-mnop",
          },
          started: "02:00",
          ends: "03:00",
        },
        {
          id: 1,
          meet_link: "https://google.meet.com/fedrfgrgr",
          status: "checked",
          student: {
            name: "محمد بلال",
            phone: "201283410254",
            id: "abcd-efgh-ijkl-mnop",
          },
          teacher: {
            name: "محمد علي",
            phone: "201234567890",
            id: "abcd-efgh-ijkl-mnop",
          },
          started: "02:00",
          ends: "03:00",
        },
        {
          id: 1,
          status: "didnt_start",
          student: {
            name: "محمد بلال",
            phone: "201283410254",
            id: "abcd-efgh-ijkl-mnop",
          },
          teacher: {
            name: "محمد علي",
            phone: "201234567890",
            id: "abcd-efgh-ijkl-mnop",
          },
          started: "02:00",
          ends: "03:00",
        },
        {
          id: 1,
          meet_link: "https://google.meet.com/fedrfgrgr",
          status: "checked",
          student: {
            name: "محمد بلال",
            phone: "201283410254",
            id: "abcd-efgh-ijkl-mnop",
          },
          teacher: {
            name: "محمد علي",
            phone: "201234567890",
            id: "abcd-efgh-ijkl-mnop",
          },
          started: "02:00",
          ends: "03:00",
        },

        {
          id: 1,
          status: "didnt_start",
          student: {
            name: "محمد بلال",
            phone: "201283410254",
            id: "abcd-efgh-ijkl-mnop",
          },
          teacher: {
            name: "محمد علي",
            phone: "201234567890",
            id: "abcd-efgh-ijkl-mnop",
          },
          started: "02:00",
          ends: "03:00",
        },
        {
          id: 1,
          meet_link: "https://google.meet.com/fedrfgrgr",
          status: "didnt_checked",
          student: {
            name: "محمد بلال",
            phone: "201283410254",
            id: "abcd-efgh-ijkl-mnop",
          },
          teacher: {
            name: "محمد علي",
            phone: "201234567890",
            id: "abcd-efgh-ijkl-mnop",
          },
          started: "02:00",
          ends: "03:00",
        },
        {
          id: 1,
          meet_link: "https://google.meet.com/fedrfgrgr",
          status: "didnt_checked",
          student: {
            name: "محمد بلال",
            phone: "201283410254",
            id: "abcd-efgh-ijkl-mnop",
          },
          teacher: {
            name: "محمد علي",
            phone: "201234567890",
            id: "abcd-efgh-ijkl-mnop",
          },
          started: "02:00",
          ends: "03:00",
        },
        {
          id: 1,
          meet_link: "https://google.meet.com/fedrfgrgr",
          status: "checked",
          student: {
            name: "محمد بلال",
            phone: "201283410254",
            id: "abcd-efgh-ijkl-mnop",
          },
          teacher: {
            name: "محمد علي",
            phone: "201234567890",
            id: "abcd-efgh-ijkl-mnop",
          },
          started: "02:00",
          ends: "03:00",
        },
        {
          id: 1,
          status: "didnt_start",
          student: {
            name: "محمد بلال",
            phone: "201283410254",
            id: "abcd-efgh-ijkl-mnop",
          },
          teacher: {
            name: "محمد علي",
            phone: "201234567890",
            id: "abcd-efgh-ijkl-mnop",
          },
          started: "02:00",
          ends: "03:00",
        },
        {
          id: 1,
          meet_link: "https://google.meet.com/fedrfgrgr",
          status: "checked",
          student: {
            name: "محمد بلال",
            phone: "201283410254",
            id: "abcd-efgh-ijkl-mnop",
          },
          teacher: {
            name: "محمد علي",
            phone: "201234567890",
            id: "abcd-efgh-ijkl-mnop",
          },
          started: "02:00",
          ends: "03:00",
        },
      ],
    });
  }, []);

  if (response === undefined) {
    return <LoadingDiv loading />;
  }

  if (response === null) {
    return <></>;
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

  return <SuccesContent meetings={response.meetings} />;
};

export default AdminContent;
