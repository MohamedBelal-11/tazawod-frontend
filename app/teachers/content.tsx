"use client";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { backendUrl } from "../utils/auth";
import axios from "axios";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import ArabicLayout from "../components/arabicLayout";
import { ChevronDoubleLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import LoadingDiv from "../components/loadingDiv";
import { numList } from "../utils/string";
import { get } from "../utils/docQuery";
import { secondsToHrs } from "../content";
import { hrNumber } from "../utils/time";

// creating page classes
const classes: { [key: string]: string } = {
  inp:
    "p-1 text-lg rounded-md outline-0 border-2 border-solid " +
    "border-gray-300 focus:border-sky-500 w-full my-2",
};

// typing the response
type Responset =
  | {
      succes: true;
      userType: "admin" | "superadmin";
      teachers: (
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
          }
      )[];
    }
  | { succes: false; error: number }
  | null;

const fetchData = async (
  query: string,
  setter: Dispatch<SetStateAction<Response | undefined>>
) => {
  // Retrieve the token from the local storage.
  const token = localStorage.getItem("token");
  try {
    // Make an HTTP GET request to the server.
    // The request includes an Authorization header with the token.
    const respons = await axios.get(backendUrl + "/api/teachers?" + query, {
      headers: {
        // Set the Authorization header to include the token.
        Authorization: `Token ${token}`,
      },
    });
    // If the request is successful, update the response state with the data received from the server.
    setter(respons.data);
  } catch (error: any) {
    // If there is an error, log the error to the console.
    console.error(error);
  }
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
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openedTeacher, setOpenedTeacher] = useState<number>();
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
    if (openedTeacher !== undefined) {
      get<HTMLBodyElement>("body")[0].classList.add("overflow-y-hidden");
    } else {
      get<HTMLBodyElement>("body")[0].classList.remove("overflow-y-hidden");
    }
  }, [openedTeacher]);

  // create useEffect function
  useEffect(() => {
    setResponse({
      succes: true,
      userType: "admin",
      teachers: [
        {
          id: "aaaa",
          name: "علي خالد علي",
          phone: "201211111111",
          is_accepted: true,
          work_hours: 7200,
          prefered_time: "afternoon",
          description: "بلا بلا بلا \n بلا بلا بلا",
          students: [],
        },
        {
          id: "aaab",
          name: "عمر علاء الدين أبو بكر",
          phone: "201211111112",
          is_accepted: true,
          work_hours: 7200,
          prefered_time: "afternoon",
          description:
            "بلا بلا بلا \n بلا بلا بلا \nبلا بلا بلا \n بلا بلا بلا \nبلا بلا بلا \n بلا بلا بلا \n",
          students: [
            { name: "محمود جمال", id: "aaarr" },
            { name: "محمود جمال", id: "aaarr" },
            { name: "محمود جمال", id: "aaarr" },
            { name: "محمود جمال", id: "aaarr" },
          ],
        },
        {
          id: "aaac",
          name: "فارس شعبان",
          phone: "201211111113",
          is_accepted: true,
          work_hours: 7200,
          prefered_time: "afternoon",
          description: "",
          students: [],
        },
        {
          id: "aaad",
          name: "فارس هيثم",
          phone: "201211111114",
          is_accepted: true,
          work_hours: 7200,
          prefered_time: "afternoon",
          description: "",
          students: [],
        },
        {
          id: "aaae",
          name: "عبدالرحمان",
          phone: "201211111115",
          is_accepted: false,
          prefered_time: "afternoon",
          description: "",
        },
        {
          id: "aaaf",
          name: "عبدالله",
          phone: "201211111116",
          is_accepted: false,
          prefered_time: "afternoon",
          description: "",
        },
        {
          id: "aaag",
          name: "محمد أحمد محمد",
          phone: "201211111117",
          is_accepted: false,
          prefered_time: "afternoon",
          description: "",
        },
        {
          id: "aaah",
          name: "مازن محمد (الجمل)",
          phone: "201211111118",
          is_accepted: true,
          work_hours: 7200,
          prefered_time: "afternoon",
          description: "",
          students: [],
        },
        {
          id: "aaai",
          name: "مازن هاني",
          phone: "201211111119",
          is_accepted: false,
          prefered_time: "afternoon",
          description: "",
        },
        {
          id: "aaaj",
          name: "محمد محمود",
          phone: "201211111110",
          is_accepted: false,
          prefered_time: "afternoon",
          description: "",
        },
      ],
    });
    setLoaded(true);
  }, []);

  // return the content
  return (
    <ArabicLayout>
      <div className="h-px"></div>
      <LoadingDiv loading={!loaded} />
      {response ? (
        response.succes ? (
          <main className="flex bg-white rounded-xl my-6 md:mx-8 max-w-screen overflow-x-hidden">
            <AnimatePresence>
              {openedTeacher !== undefined &&
                (() => {
                  const teacher = response.teachers[openedTeacher];
                  return (
                    <motion.div
                      className="w-full top-0 right-0 h-screen fixed flex items-center justify-center cursor-pointer"
                      style={{ zIndex: 10, backgroundColor: "#0006" }}
                    >
                      <div
                        className="w-full h-full absolute"
                        style={{ zIndex: -1 }}
                        onClick={() => setOpenedTeacher(undefined)}
                      ></div>
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
                            onClick={() => setOpenedTeacher(undefined)}
                          >
                            <XMarkIcon width={20} />
                          </div>
                        </div>
                        <Link
                          href={`/teachers/teacher/${teacher.id}`}
                          className="sm:text-3xl text-xl text-green-400 hover:underline block"
                        >
                          {teacher.name}
                        </Link>
                        <p className="text-2xl my-4">
                          <span dir="ltr">+{teacher.phone}</span>
                        </p>
                        <p>
                          {teacher.is_accepted
                            ? "موافق عليه"
                            : "غير موافق عليه"}
                        </p>

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
                            <p>
                              عدد ساعات العمل{" "}
                              {hrNumber(secondsToHrs(teacher.work_hours))}
                            </p>
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
                                      href={`/students/student/${student.id}`}
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
                          href={`/teachers/teacher/${teacher.id}`}
                          className={
                            "p-4 rounded-lg bg-green-200 hover:bg-green-500 border-2 " +
                            "border-solid border-green-500 transition-all w-full my-4 block"
                          }
                        >
                          صفحة المستخدم
                        </Link>
                      </motion.div>
                    </motion.div>
                  );
                })()}
            </AnimatePresence>
            {/* creating filters div */}
            <div className="flex">
              <div
                className={`overflow-x-hidden ${
                  filtersDivOpened ? "w-64" : "w-0"
                } transition-all duration-300`}
                style={{ maxWidth: "80vw" }}
              >
                <div
                  className={
                    "p-4 overflow-x-hidden bg-white"
                  }
                >
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
                      if (
                        [...numList, ""].includes(
                          value.length > 0 ? value[value.length - 1] : ""
                        )
                      ) {
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
            <div className="flex flex-wrap justify-evenly gap-2">
              {response.teachers.map((teacher, i) => (
                <motion.div
                  key={teacher.id}
                  initial={{
                    opacity: 0,
                    y: 50,
                  }}
                  animate={{
                    opacity: openedTeacher === i ? 0 : 1,
                    y: openedTeacher === i ? 80 : 0,
                    transition: { delay: openedTeacher === i ? 0 : i * 0.2 },
                  }}
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
            </div>
          </main>
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
                <Link href="/">الصفحة الرئيسية</Link>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </ArabicLayout>
  );
};

// export the content
export default Content;
