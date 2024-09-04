"use client";
import LoadingDiv from "@/app/components/loadingDiv";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { classes } from "./teacher";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import ScrollTopButton from "@/app/components/scrollTopButton";
import Checker from "@/app/components/Checker";
import { motion, Variants } from "framer-motion";
import { convertEgyptTimeToLocalTime } from "@/app/utils/time";
import Popup from "@/app/components/popup";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { almightyTrim, numList } from "@/app/utils/string";
import Button, { getClass } from "@/app/components/button";
import Link from "next/link";
import { DefaultResponse, fetchResponse } from "@/app/utils/response";

type Status = "didnt_start" | "didnt_checked" | "checked";

const embValue = <T = any,>(value: T, arr: T[]) => {
  if (!arr.includes(value)) {
    return [...arr, value];
  }
  if (arr.length === 1) {
    return arr;
  }
  return arr.filter((v) => v !== value);
};

interface User {
  name: string;
  gmail: string;
  id: string;
}

type Meet =
  | {
      status: "didnt_start";
      teacher: null;
      student: User;
      id: number;
      meet_link: string;
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
  hidden: { opacity: 0, x: 100 },
  visible: { transition: { type: "spring", stiffness: 200 }, opacity: 1, x: 0 },
};

type Responset =
  | {
      succes: true;
      meetings: Meet[];
      has_more: boolean;
    }
  | {
      succes: false;
      error: number;
    }
  | null;

interface Filters {
  studentName: string;
  teacherName: string;
  studentGmail: string;
  teacherGmail: string;
  statuses: Status[];
}

const MeetingDiv: React.FC<{
  meeting: Meet;
  onClose: () => void;
  refetch: () => void;
}> = ({ meeting, onClose, refetch }) => {
  const [response, setResponse] = useState<DefaultResponse>();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <button
        style={{ zIndex: 1 }}
        className={
          "absolute top-4 bg-white right-4 p-2 rounded-full " +
          "border-2 border-gray-600 hover:bg-gray-300 transition-all duration-300"
        }
        onClick={onClose}
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
          Student: {meeting.student.name}
        </Link>
        <p className="text-xl mb-4">Email: {meeting.student.gmail}</p>
        {meeting.teacher ? (
          <>
            <Link
              href={`/ar/teachers/teacher/${meeting.teacher.id}`}
              className="text-xl mb-4 text-green-500 hover:underline block"
            >
              Teacher: {meeting.teacher.name}
            </Link>
            <p className="text-xl mb-4">Email: {meeting.teacher.gmail}</p>
          </>
        ) : (
          <p className="text-xl mb-4 text-red-500">There is no teacher.</p>
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
            ? "This student does not have a teacher yet."
            : meeting.status === "didnt_checked"
            ? "Not verified"
            : "Verified"}
        </p>
        {meeting.status !== "didnt_start" ? (
          <div className="flex justify-evenly">
            <a
              href={meeting.meet_link}
              className={getClass({ color: "sky" }) + ""}
            >
              Enter the meeting
            </a>
            {meeting.status === "didnt_checked" ? (
              <Button
                color={loading ? "gray" : "green"}
                onClick={
                  loading
                    ? undefined
                    : () =>
                        fetchResponse({
                          setResponse,
                          setLoading,
                          url: `/meetings/${meeting.id}/check/`,
                          onFinish(succes) {
                            if (succes) {
                              refetch();
                            }
                          },
                        })
                }
              >
                I made sure the interview went well.
              </Button>
            ) : (
              <Button
                color={loading ? "gray" : "red"}
                onClick={
                  loading
                    ? undefined
                    : () =>
                        fetchResponse({
                          setResponse,
                          setLoading,
                          url: `/meetings/${meeting.id}/uncheck/`,
                          onFinish(succes) {
                            if (succes) {
                              refetch();
                            }
                          },
                        })
                }
              >
                There is an error in the meeting.
              </Button>
            )}
          </div>
        ) : undefined}
        {response !== undefined && (
          <p
            className={`p-6 bg-${
              response && response.succes ? "green" : "red"
            }-300 border-2 border-${
              response && response.succes ? "green" : "red"
            }-500 rounded-xl mt-4`}
          >
            {response === null
              ? "Something went wrong"
              : response.succes
              ? "Successfully done"
              : "Something went wrong"}
          </p>
        )}
      </div>
    </>
  );
};

const SuccesContent: React.FC<{
  meetings: Meet[];
  has_more: boolean;
  setResponse: Dispatch<SetStateAction<Responset | undefined>>;
}> = ({ meetings, has_more, setResponse }) => {
  const [filterOpened, setFilterOpened] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    studentName: "",
    teacherName: "",
    studentGmail: "",
    teacherGmail: "",
    statuses: ["didnt_start", "didnt_checked", "checked"],
  });
  const [popup, setPopup] = useState<number>();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      has_more &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [has_more, loading]);

  useEffect(() => {
    setPage(1);
    const query = new URLSearchParams({
      studentName: almightyTrim(filters.studentName),
      teacherName: almightyTrim(filters.teacherName),
      studentGmail: filters.studentGmail.trim(),
      teacherGmail: filters.teacherGmail.trim(),
      page: "1",
    });
    filters.statuses.forEach((status) => {
      query.append("status", status);
    });
    fetchResponse({
      setResponse,
      url: "/api/admin-meetings/",
      query: query.toString(),
      setLoading,
    });
  }, [filters, setResponse]);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (page !== 1) {
      const query = new URLSearchParams({
        studentName: almightyTrim(filters.studentName),
        teacherName: almightyTrim(filters.teacherName),
        studentGmail: filters.studentGmail.trim(),
        teacherGmail: filters.teacherGmail.trim(),
        page: page.toString(),
      });
      filters.statuses.forEach((status) => {
        query.append("status", status);
      });
      fetchResponse({
        setResponse,
        url: "/api/admin-meetings/",
        query: query.toString(),
        setLoading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const refetch = useCallback(() => {
    const query = new URLSearchParams({
      studentName: almightyTrim(filters.studentName),
      teacherName: almightyTrim(filters.teacherName),
      studentGmail: filters.studentGmail.trim(),
      teacherGmail: filters.teacherGmail.trim(),
      page: page.toString(),
    });
    filters.statuses.forEach((status) => {
      query.append("status", status);
    });
    fetchResponse({
      setResponse,
      url: "/api/admin-meetings/",
      query: query.toString(),
      setLoading,
    });
  }, [filters, page, setResponse]);

  useEffect(() => {
    const refresh = setInterval(refetch, 10000);
    return () => clearInterval(refresh);
  }, [refetch]);

  return (
    <>
      <Popup onClose={() => setPopup(undefined)} visible={popup !== undefined}>
        {(() => {
          if (popup === undefined) {
            return;
          }
          const meetinglists = meetings.filter((m) => m.id === popup);
          if (meetinglists.length === 0) {
            setPopup(undefined);
            return;
          }
          return (
            <MeetingDiv
              meeting={meetinglists[0]}
              onClose={() => setPopup(undefined)}
              refetch={refetch}
            />
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
                placeholder="Student name"
                type="text"
                className={classes["inp"]}
                value={filters.studentName}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, studentName: e.target.value }))
                }
              />
              <input
                placeholder="Teacher name"
                type="text"
                className={classes["inp"]}
                value={filters.teacherName}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, teacherName: e.target.value }))
                }
              />
              <input
                placeholder="Student email"
                type="text"
                className={classes["inp"]}
                value={filters.studentGmail}
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
                    setFilters((f) => ({ ...f, studentGmail: e.target.value }));
                  }
                }}
              />
              <input
                placeholder="Teacher email"
                type="text"
                className={classes["inp"]}
                value={filters.teacherGmail}
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
                    setFilters((f) => ({ ...f, teacherGmail: e.target.value }));
                  }
                }}
              />
              <div className="mt-4">
                <Checker
                  id="didnt_start"
                  label="Does not have a teacher yet."
                  type="checkbox"
                  checked={filters.statuses.includes("didnt_start")}
                  onChange={() => {
                    setFilters((f) => ({
                      ...f,
                      statuses: embValue("didnt_start", f.statuses),
                    }));
                  }}
                />
                <Checker
                  id="didnt_checked"
                  label="Not verified"
                  type="checkbox"
                  checked={filters.statuses.includes("didnt_checked")}
                  onChange={() => {
                    setFilters((f) => ({
                      ...f,
                      statuses: embValue("didnt_checked", f.statuses),
                    }));
                  }}
                />
                <Checker
                  id="checked"
                  label="Verified"
                  type="checkbox"
                  checked={filters.statuses.includes("checked")}
                  onChange={() => {
                    setFilters((f) => ({
                      ...f,
                      statuses: embValue("checked", f.statuses),
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
            {meetings.map((meeting) => (
              <motion.div
                key={meeting.id}
                className="p-4 border-2 border-gray-700 cursor-pointer rounded-lg *:mb-3 w-64"
                onClick={() => setPopup(meeting.id)}
                variants={childVariants}
              >
                {meeting.teacher ? (
                  <p>
                    Student {meeting.student.name + "'s"} lesson with teacher{" "}
                    {meeting.teacher.name}
                  </p>
                ) : (
                  <p>There is no teacher for the student {meeting.student.name}</p>
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
                    ? "This student does not have a teacher yet."
                    : meeting.status === "didnt_checked"
                    ? "Not verified"
                    : "Verified"}
                </p>
                <p>started at {convertEgyptTimeToLocalTime(meeting.started)}</p>
                <p className="mb-0">
                  ends at {convertEgyptTimeToLocalTime(meeting.ends)}
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

const AdminContent: React.FC = () => {
  const [response, setResponse] = useState<Responset>();

  useEffect(() => {
    fetchResponse({ setResponse, url: "/api/admin-meetings/" });
  }, []);

  if (response === undefined) {
    return <LoadingDiv loading />;
  }

  if (response === null) {
    return (
      <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
        Something went wrong.
      </div>
    );
  }

  if (!response.succes) {
    if (response.error === 3) {
      return (
        <div className="p-4">
          <p className="p-6 bg-white rounded-lg text-gray-600">
            You have not been approved yet so you cannot access this page yet.
          </p>
        </div>
      );
    }
    return (
      <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
        Something went wrong.
      </div>
    );
  }

  return (
    <SuccesContent
      meetings={response.meetings}
      has_more={response.has_more}
      setResponse={setResponse}
    />
  );
};

export default AdminContent;
