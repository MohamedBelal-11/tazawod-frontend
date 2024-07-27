"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ArabicLayout from "../components/arabicLayout";
import { AnimatePresence, motion } from "framer-motion";
import { numList } from "../utils/string";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { backendUrl } from "../utils/auth";
import axios from "axios";
import Link from "next/link";
import { get } from "../utils/docQuery";
import Button from "@/app/components/button";

// creating page classes
const classes: { [key: string]: string } = {
  inp:
    "p-1 text-lg rounded-md outline-0 border-2 border-solid " +
    "border-gray-300 focus:border-sky-500 w-full my-2",
};

// typing the response
type Response =
  | {
      succes: true;
      admins: {
        id: string;
        name: string;
        phone: string;
        is_accepted: boolean;
        description: string | null;
      }[];
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
    const respons = await axios.get(backendUrl + "/api/admins?" + query, {
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

const boolValues = ["both", "true", "false"];

const Content = () => {
  // create response state
  const [response, setResponse] = useState<Response>();
  // create a state for filters div
  const [filtersDivOpened, setFiltersDivOpened] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openedStudent, setOpenedSudent] = useState<number>();
  // create state for filters
  const [filters, setFilters] = useState<{
    name: string;
    phone: string;
    is_accepted: "both" | "false" | "true";
  }>({
    name: searchParams.get("name") || "",
    phone: searchParams.get("phone") || "",
    is_accepted: boolValues.includes(searchParams.get("is_accepted") || "")
      ? (searchParams.get("is_accepted") as "both" | "false" | "true")
      : "both",
  });

  // Update state when query changes
  useEffect(() => {
    setFilters({
      name: searchParams.get("name") || "",
      phone: searchParams.get("phone") || "",
      is_accepted: boolValues.includes(searchParams.get("is_accepted") || "")
        ? (searchParams.get("is_accepted") as "both" | "false" | "true")
        : "both",
    });
  }, [searchParams]);

  // Update query parameters when inputs change
  useEffect(() => {
    const query = new URLSearchParams(filters);
    router.replace(`?${query.toString()}`);
    // fetchData(query.toString(), setResponse);
  }, [filters, router]);

  useEffect(() => {
    if (openedStudent !== undefined) {
      get<HTMLBodyElement>("body")[0].classList.add("overflow-y-hidden");
    } else {
      get<HTMLBodyElement>("body")[0].classList.remove("overflow-y-hidden");
    }
  }, [openedStudent]);

  // create useEffect function
  useEffect(() => {
    setResponse({
      succes: true,
      admins: [
        {
          id: "aaaa",
          name: "علي خالد علي",
          phone: "201211111111",
          is_accepted: true,
          description: "بلا بلا بلا بلاب بلاب الب بلا\n dddddddddddddddddddd",
        },
        {
          id: "aaab",
          name: "عمر علاء الدين أبو بكر",
          phone: "201211111112",
          is_accepted: true,
          description: "بلا بلا بلا بلاب بلاب الب بلا\n dddddddddddddddddddd",
        },
        {
          id: "aaac",
          name: "فارس شعبان",
          phone: "201211111113",
          is_accepted: true,
          description: "بلا بلا بلا بلاب بلاب الب بلا\n dddddddddddddddddddd",
        },
        {
          id: "aaad",
          name: "فارس هيثم",
          phone: "201211111114",
          is_accepted: true,
          description: "بلا بلا بلا بلاب بلاب الب بلا\n dddddddddddddddddddd",
        },
        {
          id: "aaae",
          name: "عبدالرحمان",
          phone: "201211111115",
          is_accepted: false,
          description: "بلا بلا بلا بلاب بلاب الب بلا\n dddddddddddddddddddd",
        },
        {
          id: "aaaf",
          name: "عبدالله",
          phone: "201211111116",
          is_accepted: false,
          description: "بلا بلا بلا بلاب بلاب الب بلا\n dddddddddddddddddddd",
        },
        {
          id: "aaag",
          name: "محمد أحمد محمد",
          phone: "201211111117",
          is_accepted: false,
          description: "بلا بلا بلا بلاب بلاب الب بلا\n dddddddddddddddddddd",
        },
        {
          id: "aaah",
          name: "مازن محمد (الجمل)",
          phone: "201211111118",
          is_accepted: true,
          description: "بلا بلا بلا بلاب بلاب الب بلا\n dddddddddddddddddddd",
        },
        {
          id: "aaai",
          name: "مازن هاني",
          phone: "201211111119",
          is_accepted: false,
          description: "بلا بلا بلا بلاب بلاب الب بلا\n dddddddddddddddddddd",
        },
        {
          id: "aaaj",
          name: "محمد محمود",
          phone: "201211111110",
          is_accepted: false,
          description: "بلا بلا بلا بلاب بلاب الب بلا\n dddddddddddddddddddd",
        },
      ],
    });
  }, []);

  // return the content
  return (
    <ArabicLayout>
      <div className="h-px"></div>
      {response ? (
        response.succes ? (
          <main className="flex bg-white rounded-xl my-6 md:mx-8 max-w-screen overflow-x-hidden">
            {/* creating filters div */}
            <AnimatePresence>
              {openedStudent !== undefined &&
                (() => {
                  const admin = response.admins[openedStudent];
                  return (
                    <motion.div
                      className="w-full top-0 right-0 h-screen fixed flex items-center justify-center cursor-pointer"
                      style={{ zIndex: 10, backgroundColor: "#0006" }}
                    >
                      <div
                        className="w-full h-full absolute"
                        style={{ zIndex: -1 }}
                        onClick={() => setOpenedSudent(undefined)}
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
                            className="p-1 rounded-full border-2 border-gray-400 border-solid cursor-pointer"
                            onClick={() => setOpenedSudent(undefined)}
                          >
                            <XMarkIcon width={20} />
                          </div>
                        </div>
                        <p className="sm:text-3xl text-xl">{admin.name}</p>
                        <p className="text-2xl my-4">
                          <span dir="ltr">+{admin.phone}</span>
                        </p>
                        <p>
                          {admin.is_accepted ? "موافق عليه" : "غير موافق عليه"}
                        </p>

                        {Boolean(admin.description) && (
                          <div className="p-4">
                            {admin.description!.split("\n").map((line, i) => (
                              <p key={i} className="py-1">
                                {line}
                              </p>
                            ))}
                          </div>
                        )}
                        <Button
                          color={admin.is_accepted ? "red" : undefined}
                          className="w-full"
                          padding={3}
                        >
                          {admin.is_accepted ? "إلغاء الموافقة" : "موافقة"}
                        </Button>
                      </motion.div>
                    </motion.div>
                  );
                })()}
            </AnimatePresence>
            <div className="flex">
              <div
                className={`overflow-x-hidden ${
                  filtersDivOpened ? "w-64" : "w-0"
                } transition-all duration-300`}
                style={{ maxWidth: "80vw" }}
              >
                <div className={"p-4 overflow-x-hidden bg-white w-full"}>
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
              {response.admins.map((admin, i) => (
                <motion.div
                  key={admin.id}
                  initial={{
                    opacity: 0,
                    y: 50,
                  }}
                  animate={{
                    opacity: openedStudent === i ? 0 : 1,
                    y: openedStudent === i ? 80 : 0,
                    transition: { delay: openedStudent === i ? 0 : i * 0.2 },
                  }}
                  className={
                    "border-4 border-solid border-gray-300 sm:w-64 " +
                    "p-4 w-40 rounded-xl my-4 cursor-pointer"
                  }
                  style={{ minHeight: 200 }}
                  onClick={() => setOpenedSudent(i)}
                >
                  <p className="text-xl">{admin.name}</p>
                  <p className="text-lg my-2">
                    <span dir="ltr">+{admin.phone}</span>
                  </p>
                  <p>{admin.is_accepted ? "موافق عليه" : "غير موافق عليه"}</p>
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
