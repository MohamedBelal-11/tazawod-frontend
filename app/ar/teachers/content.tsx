"use client";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { backendUrl } from "../../utils/auth";
import axios from "axios";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import ArabicLayout from "../../components/arabicLayout";
import { ChevronDoubleLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { almightyTrim, numList } from "../../utils/string";
import { get } from "../../utils/docQuery";
import { secondsToHrs } from "../content";
import { hrNumber } from "../../utils/time";
import ScrollTopButton from "@/app/components/scrollTopButton";
import {
  childVariantsforfilters,
  parentVariantsforfilters,
} from "../admins/content";
import { fetchResponse } from "@/app/utils/response";
import LoadingDiv from "@/app/components/loadingDiv";

// creating page classes
const classes: { [key: string]: string } = {
  inp:
    "p-1 text-lg rounded-md outline-0 border-2 border-solid " +
    "border-gray-300 focus:border-sky-500 w-full my-2",
};

type Teacher =
  | {
      id: string;
      name: string;
      phone: string;
      description: string | null;
      prefered_time: "morning" | "afternoon" | "night";
      is_accepted: true;
      work_hours: number;
      students: { id: string; name: string }[];
    }
  | {
      id: string;
      name: string;
      phone: string;
      description: string;
      prefered_time: "morning" | "afternoon" | "night";
      is_accepted: false;
    };

// typing the response
type Responset =
  | {
      succes: true;
      userType: "admin" | "superadmin";
      has_more: boolean;
      teachers: Teacher[];
    }
  | { succes: false; error: number }
  | null;

const TeacherDiv: React.FC<{
  teacher: Teacher;
  closeP: () => void;
}> = ({ teacher, closeP }) => {
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
          className={
            "p-1 rounded-full border-2 border-gray-400 " +
            "border-solid cursor-pointer"
          }
          onClick={closeP}
        >
          <XMarkIcon width={20} />
        </div>
      </div>
      <Link
        href={`/ar/teachers/teacher/${teacher.id}`}
        className="sm:text-3xl text-xl text-green-400 hover:underline block"
      >
        {teacher.name}
      </Link>
      <p className="text-2xl my-4">
        <span dir="ltr">+{teacher.phone}</span>
      </p>
      <p>{teacher.is_accepted ? "موافق عليه" : "غير موافق عليه"}</p>

      <p>
        يفضل العمل{" "}
        {teacher.prefered_time === "morning"
          ? "صباحًا"
          : teacher.prefered_time === "afternoon"
          ? "بعد الظهيرة"
          : "ليلًا"}
      </p>

      {Boolean(teacher.description) && (
        <div className="p-4">
          {teacher.description!.split("\n").map((line, i) => (
            <p key={i} className="py-1">
              {line}
            </p>
          ))}
        </div>
      )}

      {teacher.is_accepted && (
        <>
          <p>عدد ساعات العمل {hrNumber(secondsToHrs(teacher.work_hours))}</p>
          <p className="text-lg flex items-center gap-2 mt-4">
            <span className="block">الطلاب</span>
            <span className="py-1 px-2 rounded bg-green-400 h-min block">
              {teacher.students.length}
            </span>
          </p>
          {teacher.students.length !== 0 && (
            <ul className="list-disc ps-4 mt-4">
              {teacher.students.map((student, i) => (
                <li key={i}>
                  <Link
                    href={`/ar/students/student/${student.id}`}
                    className="hover:text-green-600"
                  >
                    {student.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <Link
        href={`/ar/teachers/teacher/${teacher.id}`}
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

const sorts = ["date_created", "work_hours", "students_number"];

const boolValues = ["both", "true", "false"];

const pts: ("morning" | "afternoon" | "night")[] = [
  "morning",
  "afternoon",
  "night",
];

const Content = () => {
  // create response state
  const [response, setResponse] = useState<Responset>();
  // create a state for filters div
  const [filtersDivOpened, setFiltersDivOpened] = useState(true);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openedTeacher, setOpenedTeacher] = useState<number>();
  const [loading, setLoading] = useState(true);
  const getPrefereTimes = useCallback(() => {
    const pt = searchParams.getAll("pt") as (
      | "morning"
      | "afternoon"
      | "night"
    )[];
    let rpt: ("morning" | "afternoon" | "night")[] = [];
    pt.forEach((pdt) => {
      if (pts.includes(pdt) && !rpt.includes(pdt)) {
        rpt.push(pdt);
      }
    });
    return rpt.length > 0 ? rpt : pts;
  }, [searchParams]);
  // create state for filters
  const [filters, setFilters] = useState<{
    name: string;
    phone: string;
    is_accepted: "both" | "false" | "true";
    prefered_times: ("morning" | "afternoon" | "night")[];
  }>({
    name: searchParams.get("name") || "",
    phone: searchParams.get("phone") || "",
    is_accepted: boolValues.includes(searchParams.get("is_accepted") || "")
      ? (searchParams.get("is_accepted") as "both" | "false" | "true")
      : "both",
    prefered_times: getPrefereTimes(),
  });
  const [sort, setSort] = useState<
    ["date_created" | "work_hours" | "students_number", boolean]
  >([
    sorts.includes(searchParams.get("sorted_by") || "")
      ? (searchParams.get("sorted_by") as
          | "date_created"
          | "work_hours"
          | "students_number")
      : "date_created",
    searchParams.get("reversed") === "true",
  ]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      Boolean(response && response.succes && response.has_more) &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, response]);
  const setPreferedTimes = (
    method: (
      pts: ("morning" | "afternoon" | "night")[]
    ) => ("morning" | "afternoon" | "night")[]
  ) => {
    setFilters((f) => ({ ...f, prefered_times: method(f.prefered_times) }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    setPreferedTimes((prev) =>
      checked
        ? prev.includes(value as "morning" | "afternoon" | "night")
          ? prev
          : [...prev, value as "morning" | "afternoon" | "night"]
        : prev.filter((v) => v !== value).length === 0
        ? prev
        : prev.filter((v) => v !== value)
    );
  };

  // Update state when query changes
  useEffect(() => {
    setFilters({
      name: searchParams.get("name") || "",
      phone: searchParams.get("phone") || "",
      is_accepted: boolValues.includes(searchParams.get("is_accepted") || "")
        ? (searchParams.get("is_accepted") as "both" | "false" | "true")
        : "both",
      prefered_times: getPrefereTimes(),
    });
    setSort([
      sorts.includes(searchParams.get("sorted_by") || "")
        ? (searchParams.get("sorted_by") as
            | "date_created"
            | "work_hours"
            | "students_number")
        : "date_created",
      searchParams.get("reversed") === "true",
    ]);
  }, [getPrefereTimes, searchParams]);

  // Update query parameters when inputs change
  useEffect(() => {
    const query = new URLSearchParams({
      is_accepted: filters.is_accepted,
      phone: filters.phone,
      name: filters.name,
      sorted_by: sort[0],
      reversed: String(sort[1]),
    });
    filters.prefered_times.forEach((pt) => {
      query.append("pt", pt);
    });
    router.replace(`?${query.toString()}`);
    // fetchData(query.toString(), setResponse);
  }, [filters, router, sort]);

  useEffect(() => {
    setPage(1);
    const query = new URLSearchParams({
      name: almightyTrim(filters.name),
      phone: filters.phone,
      is_accepted: filters.is_accepted,
      sorted_by: sort[0],
      reversed: String(sort[1]),
      page: "1",
    });
    filters.prefered_times.forEach((pt) => {
      query.append("pt", pt);
    });
    fetchResponse({
      setResponse,
      url: "/api/teachers/",
      query: query.toString(),
      setLoading,
    });
  }, [filters, sort]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (page !== 1) {
      const query = new URLSearchParams({
        name: almightyTrim(filters.name),
        phone: filters.phone,
        is_accepted: filters.is_accepted,
        sorted_by: sort[0],
        reversed: String(sort[1]),
        page: page.toString(),
      });
      filters.prefered_times.forEach((pt) => {
        query.append("pt", pt);
      });
      fetchResponse({
        setResponse,
        url: "/api/teachers/",
        query: query.toString(),
        setLoading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  useEffect(() => {
    if (openedTeacher !== undefined) {
      get<HTMLBodyElement>("body")[0].classList.add("overflow-y-hidden");
    } else {
      get<HTMLBodyElement>("body")[0].classList.remove("overflow-y-hidden");
    }
  }, [openedTeacher]);

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
            <AnimatePresence>
              {openedTeacher !== undefined && (
                <motion.div
                  className="w-full top-0 right-0 h-screen fixed flex items-center justify-center cursor-pointer"
                  style={{ zIndex: 10, backgroundColor: "#0006" }}
                >
                  <div
                    className="w-full h-full absolute"
                    style={{ zIndex: -1 }}
                    onClick={() => setOpenedTeacher(undefined)}
                  ></div>
                  <TeacherDiv
                    closeP={() => setOpenedTeacher(undefined)}
                    teacher={response.teachers[openedTeacher]}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {/* creating filters div */}
            <div className="flex">
              <div
                className={`overflow-x-hidden ${
                  filtersDivOpened ? "w-64" : "w-0"
                } transition-all duration-300`}
                style={{ maxWidth: "80vw" }}
              >
                <div className={"p-4 overflow-x-hidden bg-white"}>
                  <h2 className="text-xl mb-4">ترتيب حسب</h2>
                  <div className="flex">
                    <select
                      value={sort[0]}
                      onChange={(e) =>
                        setSort((s) => [
                          e.target.value as
                            | "date_created"
                            | "work_hours"
                            | "students_number",
                          s[1],
                        ])
                      }
                      className="border-2 border-solid border-l-0 border-gray-600"
                    >
                      <option value="date_created">تاريخ الإنشاء</option>
                      <option value="work_hours">ساعات العمل</option>
                      <option value="students_number">عدد طلابه</option>
                    </select>
                    <button
                      onClick={() => setSort((s) => [s[0], !s[1]])}
                      className="border-2 border-solid border-gray-600"
                    >
                      {sort[1] ? "▼" : "▲"}
                    </button>
                  </div>
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
                    placeholder="رقم الهاتف"
                    value={filters.phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      let alive = true;
                      for (const c of value) {
                        if (numList.includes(c)) {
                          alive = false;
                          break;
                        }
                      }
                      if (alive) {
                        setFilters({ ...filters, phone: value });
                      }
                    }}
                    className={classes["inp"]}
                  />
                  <div
                    className={classes["inp"] + "flex flex-col items-center"}
                  >
                    <div>
                      <label htmlFor="true" className="ml-2">
                        موافق عليه
                      </label>
                      <input
                        type="radio"
                        id="true"
                        checked={filters.is_accepted === "true"}
                        onChange={() => {
                          setFilters({ ...filters, is_accepted: "true" });
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor="false" className="ml-2">
                        غير موافق عليه
                      </label>
                      <input
                        type="radio"
                        id="false"
                        checked={filters.is_accepted === "false"}
                        onChange={() => {
                          setFilters({ ...filters, is_accepted: "false" });
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
                        checked={filters.is_accepted === "both"}
                        onChange={() => {
                          setFilters({ ...filters, is_accepted: "both" });
                        }}
                      />
                    </div>
                  </div>
                  <p>فترة العمل</p>
                  <div
                    className={classes["inp"] + "flex flex-col items-center"}
                  >
                    <div>
                      <label htmlFor="morning" className="ml-2">
                        صباحا
                      </label>
                      <input
                        type="checkbox"
                        id="morning"
                        value="morning"
                        checked={filters.prefered_times.includes("morning")}
                        onChange={handleCheckboxChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="afternoon" className="ml-2">
                        بعد الظهيرة
                      </label>
                      <input
                        type="checkbox"
                        id="afternoon"
                        value="afternoon"
                        checked={filters.prefered_times.includes("afternoon")}
                        onChange={handleCheckboxChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="night" className="ml-2">
                        ليلًا
                      </label>
                      <input
                        type="checkbox"
                        id="night"
                        value="night"
                        checked={filters.prefered_times.includes("night")}
                        onChange={handleCheckboxChange}
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
              {response.teachers.map((teacher, i) => (
                <motion.div
                  key={teacher.id}
                  variants={childVariantsforfilters}
                  className={
                    "border-4 border-solid border-gray-300 sm:w-64 " +
                    "p-4 w-40 rounded-xl my-4 cursor-pointer"
                  }
                  style={{ minHeight: 200 }}
                  onClick={() => setOpenedTeacher(i)}
                >
                  <p className="text-xl">{teacher.name}</p>
                  <p className="text-lg my-2">
                    <span dir="ltr">+{teacher.phone}</span>
                  </p>
                  <p>{teacher.is_accepted ? "موافق عليه" : "غير موافق عليه"}</p>
                  <p>
                    يفضل العمل{" "}
                    {teacher.prefered_time === "morning"
                      ? "صباحًا"
                      : teacher.prefered_time === "afternoon"
                      ? "بعد الظهيرة"
                      : "ليلًا"}
                  </p>
                  {teacher.is_accepted && (
                    <>
                      <p>عدد الطلاب {teacher.students.length}</p>
                      <p>
                        عدد ساعات العمل{" "}
                        {hrNumber(secondsToHrs(teacher.work_hours))}
                      </p>
                    </>
                  )}
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
              <Link href="/ar/">الصفحة الرئيسية</Link>
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
