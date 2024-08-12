"use client";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
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
import Button from "@/app/components/button";
import ScrollTopButton from "@/app/components/scrollTopButton";
import { DefaultResponse, fetchResponse } from "@/app/utils/response";
import LoadingDiv from "@/app/components/loadingDiv";

// creating page classes
const classes: { [key: string]: string } = {
  inp:
    "p-1 text-lg rounded-md outline-0 border-2 border-solid " +
    "border-gray-300 focus:border-sky-500 w-full my-2",
};

interface Admin {
  id: string;
  name: string;
  phone: string;
  is_accepted: boolean;
  description: string | null;
}

// typing the response
type Response =
  | {
      succes: true;
      admins: Admin[];
      has_more: boolean;
    }
  | { succes: false; error: number }
  | null;

const boolValues = ["both", "true", "false"];

const deleteAdmin = ({
  id,
  refetch,
  closeP,
  setResponse,
}: {
  id: string;
  refetch: () => void;
  closeP: () => void;
  setResponse: React.Dispatch<SetStateAction<DefaultResponse | undefined>>;
}) => {
  fetchResponse({
    setResponse,
    url: `/users/user/${id}/delete/`,
  });
  setTimeout(() => {
    closeP();
    refetch();
  }, 3000);
};

const acceptAdmin = ({
  id,
  refetch,
  closeP,
  setResponse,
  accepted,
}: {
  id: string;
  refetch: () => void;
  closeP: () => void;
  setResponse: React.Dispatch<SetStateAction<DefaultResponse | undefined>>;
  accepted: boolean;
}) => {
  fetchResponse({
    setResponse,
    url: `/users/admin/${id}/${accepted ? "de" : ""}accept/`,
  });
  setTimeout(() => {
    closeP();
    refetch();
  }, 3000);
};

const AdminDiv: React.FC<{
  admin: Admin;
  refetch: () => void;
  closeP: () => void;
}> = ({ admin, closeP, refetch }) => {
  const [response, setResponse] = useState<DefaultResponse>();
  const [deResponse, setDeResponse] = useState<DefaultResponse>();

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
      <p className="sm:text-3xl text-xl">{admin.name}</p>
      <p className="text-2xl my-4">
        <span dir="ltr">+{admin.phone}</span>
      </p>
      <p>{admin.is_accepted ? "موافق عليه" : "غير موافق عليه"}</p>

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
        onClick={() =>
          acceptAdmin({
            id: admin.id,
            refetch,
            closeP,
            setResponse,
            accepted: admin.is_accepted,
          })
        }
      >
        {admin.is_accepted ? "إلغاء الموافقة" : "موافقة"}
      </Button>
      {response !== undefined && (
        <p
          className={`p-6 bg-${
            response && response.succes ? "green" : "red"
          }-300 border-2 border-${
            response && response.succes ? "green" : "red"
          }-500 rounded-xl`}
        >
          {response === null
            ? "حدث خطأٌ ما"
            : response.succes
            ? "تم بنجاح"
            : "حدث خطأٌ ما"}
        </p>
      )}
      <Button
        color="red"
        className="w-full"
        padding={3}
        onClick={() =>
          deleteAdmin({
            id: admin.id,
            refetch,
            closeP,
            setResponse: setDeResponse,
          })
        }
      >
        حذف
      </Button>
      {deResponse !== undefined && (
        <p
          className={`p-6 bg-${
            deResponse && deResponse.succes ? "green" : "red"
          }-300 border-2 border-${
            deResponse && deResponse.succes ? "green" : "red"
          }-500 rounded-xl`}
        >
          {deResponse === null
            ? "حدث خطأٌ ما"
            : deResponse.succes
            ? "تم الحذف بنجاح"
            : "حدث خطأٌ ما"}
        </p>
      )}
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
    phone: string;
    is_accepted: "both" | "false" | "true";
  }>({
    name: searchParams.get("name") || "",
    phone: searchParams.get("phone") || "",
    is_accepted: boolValues.includes(searchParams.get("is_accepted") || "")
      ? (searchParams.get("is_accepted") as "both" | "false" | "true")
      : "both",
  });

  const refetch = useCallback(() => {
    const query = new URLSearchParams({
      name: almightyTrim(filters.name),
      phone: filters.phone,
      is_accepted: filters.is_accepted,
      page: page.toString(),
    }).toString();
    fetchResponse({
      setResponse,
      url: "/api/admins/",
      query,
      setLoading,
    });
  }, [filters, page]);

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
      phone: searchParams.get("phone") || "",
      is_accepted: boolValues.includes(searchParams.get("is_accepted") || "")
        ? (searchParams.get("is_accepted") as "both" | "false" | "true")
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
    router.replace(`?${query.toString()}`);
  }, [filters, router]);

  useEffect(() => {
    setPage(1);
    const query = new URLSearchParams({
      name: almightyTrim(filters.name),
      phone: filters.phone,
      is_accepted: filters.is_accepted,
      page: "1",
    }).toString();
    fetchResponse({
      setResponse,
      url: "/api/admins/",
      query,
      setLoading,
    });
  }, [filters]);

  useEffect(() => {
    if (page !== 1) {
      const query = new URLSearchParams({
        name: almightyTrim(filters.name),
        phone: filters.phone,
        is_accepted: filters.is_accepted,
        page: page.toString(),
      }).toString();
      fetchResponse({
        setResponse,
        url: "/api/admins/",
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
        <div className="m-6 p-6 justify-center items-center flex">
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
                  <AdminDiv
                    admin={response.admins[openedStudent]}
                    closeP={() => setOpenedSudent(undefined)}
                    refetch={refetch}
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
                      let alive = true;
                      for (const c of value) {
                        if (!numList.includes(c)) {
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
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: i * 0.2,
                    },
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
        <></>
      )}
    </>
  );
};

// export the content
export default Content;
