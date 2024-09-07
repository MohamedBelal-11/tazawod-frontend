"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { almightyTrim, numList } from "../../utils/string";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { get } from "../../utils/docQuery";
import ScrollTopButton from "@/app/components/scrollTopButton";
import { fetchResponse } from "@/app/utils/response";
import LoadingDiv from "@/app/components/loadingDiv";
import {
  childVariantsforfilters,
  parentVariantsforfilters,
} from "../admins/content";

// creating page classes
const classes: { [key: string]: string } = {
  inp:
    "p-1 text-lg rounded-md outline-0 border-2 border-solid " +
    "border-gray-300 focus:border-sky-500 w-full my-2",
};

interface Student {
  id: string;
  name: string;
  gmail: string;
  subscribed: boolean;
  teacher: { name: string; id: string } | null;
}

// typing the response
type Response =
  | {
      succes: true;
      userType: "admin" | "superadmin";
      students: Student[];
      has_more: boolean;
    }
  | { succes: false; error: number }
  | null;

const boolValues = ["both", "true", "false"];

const StudentDiv: React.FC<{
  student: Student;
  closeP: () => void;
}> = ({ student, closeP }) => {
  return (
    <motion.div
      className="overflow-y-auto p-4 rounded-2xl bg-white cursor-auto overflow-x-hidden"
      initial={{ width: 0, height: 0 }}
      animate={{
        width: "100%",
        height: "auto",
        transition: { duration: 0.7 },
      }}
      style={{ maxWidth: 800, maxHeight: "90vh" }}
      exit={{
        width: 0,
        height: 0,
        transition: { duration: 0.7 },
      }}
      onClick={() => {}}
    >
      <div className="flex mb-1">
        <div
          className="p-1 rounded-full border-2 border-gray-400 border-solid cursor-pointer"
          onClick={closeP}
        >
          <XMarkIcon width={20} />
        </div>
      </div>
      <Link
        href={`/en/students/student/${student.id}`}
        className="sm:text-3xl text-xl text-green-400 hover:underline block"
      >
        {student.name}
      </Link>
      <p className="text-2xl my-4">
        <span dir="ltr">+{student.gmail}</span>
      </p>
      <p className="text-xl my-4">
        المعلم:{" "}
        {student.teacher ? (
          <Link
            href={`/en/teachers/teacher/${student.teacher.id}`}
            className="hover:underline hover:text-green-500"
          >
            {student.teacher.name}
          </Link>
        ) : student.subscribed ? (
          <>
            <span className="text-red-500">لا يوجد</span>
            <br />
            <span>يجب عليك إختيار معلم لهذا الطالب لأنه مشترك</span>
          </>
        ) : (
          "لا يوجد"
        )}
      </p>
      <p>{student.subscribed ? "مشترك" : "غير مشترك"}</p>

      <Link
        href={`/en/students/student/${student.id}`}
        className={
          "p-4 rounded-lg bg-green-200 hover:bg-green-500 border-2 " +
          "border-solid border-green-500 transition-all w-full my-4 block"
        }
      >
        صفحة المستخدم
      </Link>
    </motion.div>
  );
};

const Content = () => {
  // create response state
  const [response, setResponse] = useState<Response>();
  // create a state for filters div
  const [filtersDivOpened, setFiltersDivOpened] = useState(true);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openedStudent, setOpenedSudent] = useState<number>();
  const [loading, setLoading] = useState(true);
  // create state for filters
  const [filters, setFilters] = useState<{
    name: string;
    gmail: string;
    subscribed: "both" | "false" | "true";
  }>({
    name: searchParams.get("name") || "",
    gmail: searchParams.get("gmail") || "",
    subscribed: boolValues.includes(searchParams.get("subscribed") || "")
      ? (searchParams.get("subscribed") as "both" | "false" | "true")
      : "both",
  });

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      Boolean(response && response.succes && response.has_more) &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, response]);
  // Update state when query changes
  useEffect(() => {
    setFilters({
      name: searchParams.get("name") || "",
      gmail: searchParams.get("gmail") || "",
      subscribed: boolValues.includes(searchParams.get("subscribed") || "")
        ? (searchParams.get("subscribed") as "both" | "false" | "true")
        : "both",
    });
  }, [searchParams]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Update query parameters when inputs change
  useEffect(() => {
    const query = new URLSearchParams(filters);
    router.push(`?${query.toString()}`);
    // fetchData(query.toString(), setResponse);
  }, [filters, router]);

  useEffect(() => {
    setPage(1);
    const query = new URLSearchParams({
      name: almightyTrim(filters.name),
      gmail: filters.gmail,
      subscribed: filters.subscribed,
      page: "1",
    }).toString();
    fetchResponse({
      setResponse,
      url: "/api/students/",
      query,
      setLoading,
    });
  }, [filters]);

  useEffect(() => {
    if (page !== 1) {
      const query = new URLSearchParams({
        name: almightyTrim(filters.name),
        gmail: filters.gmail,
        subscribed: filters.subscribed,
        page: page.toString(),
      }).toString();
      fetchResponse({
        setResponse,
        url: "/api/students/",
        query,
        setLoading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (openedStudent !== undefined) {
      get<HTMLBodyElement>("body")[0].classList.add("overflow-y-hidden");
    } else {
      get<HTMLBodyElement>("body")[0].classList.remove("overflow-y-hidden");
    }
  }, [openedStudent]);

  // return the content
  return (
    <>
      <div className="h-px"></div>
      {response === undefined ? (
        <LoadingDiv loading />
      ) : response === null ? (
        <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
          حدث خطأٌ ما
        </div>
      ) : response.succes ? (
        <>
          <main className="flex bg-white rounded-xl my-6 md:mx-8 max-w-screen overflow-x-hidden">
            {/* creating filters div */}
            <AnimatePresence>
              {openedStudent !== undefined && (
                <motion.div
                  className="w-full top-0 right-0 h-screen fixed flex items-center justify-center cursor-pointer"
                  style={{ zIndex: 10, backgroundColor: "#0006" }}
                >
                  <div
                    className="w-full h-full absolute"
                    style={{ zIndex: -1 }}
                    onClick={() => setOpenedSudent(undefined)}
                  ></div>
                  <StudentDiv
                    closeP={() => setOpenedSudent(undefined)}
                    student={response.students[openedStudent]}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex">
              <div
                className={`overflow-x-hidden ${
                  filtersDivOpened ? "w-64" : "w-0"
                } transition-all duration-300`}
                style={{ maxWidth: "80vw" }}
              >
                <div className={"p-4 overflow-x-hidden bg-white"}>
                  <h2 className="text-xl mb-4">فلتر</h2>
                  <input
                    type="text"
                    placeholder="الاسم"
                    value={filters.name}
                    onChange={(e) => {
                      setFilters({ ...filters, name: e.target.value });
                    }}
                    className={classes["inp"]}
                  />
                  <input
                    type="text"
                    placeholder="عنوان البريد الإلكتروني"
                    value={filters.gmail}
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
                        setFilters({ ...filters, gmail: value });
                      }
                    }}
                    className={classes["inp"]}
                  />
                  <div
                    className={classes["inp"] + "flex flex-col items-center"}
                  >
                    <div>
                      <label htmlFor="true" className="ml-2">
                        مشترك
                      </label>
                      <input
                        type="radio"
                        id="true"
                        checked={filters.subscribed === "true"}
                        onChange={() => {
                          setFilters({ ...filters, subscribed: "true" });
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor="false" className="ml-2">
                        غير مشترك
                      </label>
                      <input
                        type="radio"
                        id="false"
                        checked={filters.subscribed === "false"}
                        onChange={() => {
                          setFilters({ ...filters, subscribed: "false" });
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor="both" className="ml-2">
                        الكل
                      </label>
                      <input
                        type="radio"
                        id="both"
                        checked={filters.subscribed === "both"}
                        onChange={() => {
                          setFilters({ ...filters, subscribed: "both" });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* creating toggle button of filters div */}
              <button
                className="flex border-gray-500 border-solid border-x-2 w-6"
                onClick={() => {
                  setFiltersDivOpened(!filtersDivOpened);
                }}
              >
                {filtersDivOpened ? (
                  <ChevronDoubleRightIcon
                    width={20}
                    style={{ top: 150, position: "fixed" }}
                  />
                ) : (
                  <ChevronDoubleLeftIcon
                    width={20}
                    style={{ top: 150, position: "fixed" }}
                  />
                )}
              </button>
            </div>
            <motion.div
              variants={parentVariantsforfilters}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap justify-evenly gap-2"
            >
              {response.students.map((student, i) => (
                <motion.div
                  key={student.id}
                  variants={childVariantsforfilters}
                  className={
                    "border-4 border-solid border-gray-300 sm:w-64 " +
                    "p-4 w-40 rounded-xl my-4 cursor-pointer overflow-hidden"
                  }
                  style={{ minHeight: 200 }}
                  onClick={() => setOpenedSudent(i)}
                >
                  <p className="text-xl">{student.name}</p>
                  <p className="text-lg my-2">
                    <span dir="ltr">{student.gmail}</span>
                  </p>
                  <p>{student.subscribed ? "مشترك" : "غير مشترك"}</p>
                  <p className="text-lg">
                    المعلم:{" "}
                    {student.subscribed && student.teacher === null ? (
                      <span className="text-red-500">لا يوجد</span>
                    ) : student.teacher ? (
                      student.teacher.name
                    ) : (
                      "لا يوجد"
                    )}
                  </p>
                </motion.div>
              ))}
            </motion.div>
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
          <ScrollTopButton />
        </>
      ) : response.error === 1 ? (
        <div
          className="flex justify-center items-center"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="bg-white rounded-3xl md:px-20 px-4 py-20 flex flex-col items-center gap-8">
            <p className="w-max text-nowrap md:text-5xl text-4xl font-black">
              403
            </p>
            <p className="w-max text-nowrap md:text-3xl sm:text-2xl text-sm font-black flex flex-nowrap md:gap-8 gap-4">
              <span>غير مسموح</span>
            </p>
            <div className="*:py-2 *:px-4 *:rounded-xl *:bg-green-600 *:text-white flex sm:flex-nowrap md:gap-8 sm:gap-4 gap-2">
              <Link href="/en/">الصفحة الرئيسية</Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
          حدث خطأٌ ما
        </div>
      )}
    </>
  );
};

// export the content
export default Content;
