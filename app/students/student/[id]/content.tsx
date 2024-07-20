"use client";
import ArabicLayout from "@/app/components/arabicLayout";
import LoadingDiv from "@/app/components/loadingDiv";
import { secondsToHrs } from "@/app/content";
import { arDay } from "@/app/utils/arabic";
import { get } from "@/app/utils/docQuery";
import { sum } from "@/app/utils/number";
import { objCompare } from "@/app/utils/object";
import { almightyTrim, arCharsList, charsList } from "@/app/utils/string";
import { Date, Weekday } from "@/app/utils/students";
import { convertEgyptTimeToLocalTime, hrNumber } from "@/app/utils/time";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import EditDates from "./editDates";
import MyPhoneInput from "@/app/components/phoneInput";
import Button from "@/app/components/button";
import "@/app/auth/register/student/page.css";

interface Tdate extends Date {
  price: number;
}

const Subscribe: React.FC<{
  id: string;
  onClose: () => void;
  change?: boolean;
}> = ({ id, onClose, change = false }) => {
  const [phone, setPhone] = useState("20");

  return (
    <div
      className={
        "overflow-y-auto h-max w-screen p-8 " +
        "flex flex-col items-center gap-8"
      }
      style={{ maxWidth: "30rem" }}
    >
      <p className="sm:text-3xl text-xl">
        {change ? "إختيار معلم" : "إشتراك للطالب"}
      </p>
      <div className="w-full flex flex-col items-center gap-2">
        <p>رقم المعلم</p>
        <MyPhoneInput onChange={setPhone} value={phone} />
      </div>
      <div className="flex gap-4 justify-evenly">
        <Button color="red" onClick={onClose}>
          إلغاء
        </Button>
        <Button color="green" onClick={() => {}}>
          {change ? "تم" : "إشتراك"}
        </Button>
      </div>
    </div>
  );
};

type DataEdit = {
  name: string;
  gender: "male" | "female";
  currency: "EGP" | "USD";
};

const classes: { [key: string]: string } = {
  td: "sm:text-2xl border-2 border-solid border-gray-500 sm:p-4 p-1 text-center",
  section: "rounded-xl bg-white border-4 border-solid border-gray-500 ",
  inp:
    "p-2 text-lg border-2 border-gray-300 focus:border-sky-500 " +
    "rounded-lg border-solid max-w-96 w-full outline-0 shadow-3xl",
};
// declare response type
type responset =
  | {
      succes: true;
      userType: "self" | "admin" | "superadmin";
      name: string;
      phone: string;
      subscribed: boolean;
      dates: Tdate[];
      note: {
        teacher: string;
        rate: number;
        discription: string | null;
        day: Weekday;
        date: string;
      };
      gender: "male" | "female";
      teacher: string | null;
      currency: "EGP" | "USD";
    }
  | {
      succes: false;
      error: number;
    }
  | null;

// declare edit data div component
const EditData: React.FC<{
  defaultData: DataEdit;
  onClose: () => void;
}> = ({ defaultData, onClose }) => {
  // create inputs state
  const [inputs, setInputs] = useState<DataEdit>(defaultData);
  // create message state
  const [message, setMesssage] = useState<{ name: string[] }>({ name: [] });

  const setName = (method: (name: string[]) => string[]) => {
    setMesssage((m) => ({ ...m, name: method(m.name) }));
  };

  const checkName = (name: string) => {
    setName(() => []);
    let alive = true;
    // let tmpList: any[][] = [];
    if (name.trim() === "") {
      alive = false;
      setName((m) => {
        return [...m, "رجاءً قم بملء خانة الإسم"];
      });
    }

    for (let c of almightyTrim(name)) {
      if (![...arCharsList, ...charsList, " "].includes(c)) {
        alive = false;
        setName((m) => {
          return [
            ...m,
            "يجب أن يحتوي الاسم على حروف إنجليزية أو عربية فقط (لا تشكيل)",
          ];
        });
        break;
      }
    }

    if (alive) {
      setName(() => []);
    }
  };

  // return the jsx
  return (
    <form className="h-full" onSubmit={(e) => e.preventDefault()}>
      <div className="h-full overflow-y-auto p-4 flex flex-col items-center">
        <input
          type="text"
          value={inputs.name}
          onChange={(e) => {
            setInputs((inps) => ({ ...inps, name: e.target.value }));
            checkName(e.target.value);
          }}
          placeholder="الاسم"
          className={classes["inp"]}
          maxLength={30}
          required
          autoComplete="name"
        />
        {message.name.length > 0 && (
          <div className="p-2 rounded-lg bg-red-100 border-red-500 border-solid border-2">
            {message.name.map((fault, i) => (
              <p key={i}>{fault}</p>
            ))}
          </div>
        )}
        <p className="mt-6 text-lg">الجنس</p>
        <div className={classes["inp"] + "flex flex-wrap"}>
          <div>
            <label htmlFor="male">ذكر</label>
            <input
              type="radio"
              id="male"
              checked={inputs.gender === "male"}
              onChange={() =>
                setInputs((inps) => ({ ...inps, gender: "male" }))
              }
            />
          </div>
          <div>
            <label htmlFor="female">أنثى</label>
            <input
              type="radio"
              id="female"
              checked={inputs.gender === "female"}
              onChange={() =>
                setInputs((inps) => ({ ...inps, gender: "female" }))
              }
            />
          </div>
        </div>
        <p className="mt-6 text-lg">العملة</p>
        <div className={classes["inp"] + "flex flex-wrap"}>
          <div>
            <label htmlFor="EGP">جنيه مصري</label>
            <input
              type="radio"
              id="EGP"
              checked={inputs.currency === "EGP"}
              onChange={() =>
                setInputs((inps) => ({ ...inps, currency: "EGP" }))
              }
            />
          </div>
          <div>
            <label htmlFor="USD">دولار أمريكي</label>
            <input
              type="radio"
              id="USD"
              checked={inputs.currency === "USD"}
              onChange={() =>
                setInputs((inps) => ({ ...inps, currency: "USD" }))
              }
            />
          </div>
        </div>
      </div>
      <div className="flex p-2 border-t-2 border-solid border-gray-600 justify-evenly">
        <div
          onClick={onClose}
          className={
            "p-2 border-2 border-red-500 bg-red-200 " +
            "hover:text-white hover:bg-red-500 border-solid " +
            "rounded-lg transition-all duration-300 cursor-pointer"
          }
        >
          إلغاء
        </div>
        {objCompare(
          { ...inputs, name: almightyTrim(inputs.name) },
          defaultData
        ) ? (
          <div
            className={
              "p-2 border-2 border-gray-500 bg-gray-200 " +
              "border-solid rounded-lg transition-all duration-300"
            }
          >
            تعديل
          </div>
        ) : (
          <button
            className={
              "p-2 border-2 border-green-500 bg-green-200 " +
              "hover:text-white hover:bg-green-500 border-solid " +
              "rounded-lg transition-all duration-300"
            }
            type="submit"
          >
            تعديل
          </button>
        )}
      </div>
    </form>
  );
};

type PopupData =
  | {
      state: "delete" | "desubscribe" | "change";
      dates?: undefined;
      defaultData?: undefined;
      id: string;
    }
  | {
      state: "subscribe";
      dates?: undefined;
      defaultData: boolean;
      id: string;
    }
  | {
      state?: undefined;
      dates?: undefined;
      defaultData?: undefined;
      id?: undefined;
    }
  | {
      state: "dates edit";
      dates: Date[];
      defaultData?: undefined;
      id?: undefined;
    }
  | {
      state: "data edit";
      defaultData: DataEdit;
      dates?: undefined;
      id?: undefined;
    };

const regulerConfirm = ({
  text,
  btns,
  onConfirm,
  onClose,
}: {
  text: string;
  btns?: [{ text?: string; color?: string }, { text?: string; color?: string }];
  onConfirm: () => void;
  onClose: () => void;
}) => {
  btns = btns
    ? [
        { text: btns[0].text || "تم", color: btns[0].color || "green" },
        {
          text: btns[1].text || "إلغاء",
          color: btns[1].color || "red",
        },
      ]
    : [
        { text: "تم", color: "green" },
        { text: "إلغاء", color: "red" },
      ];
  return (
    <div className="h-full overflow-y-auto flex flex-col max-w-full gap-8 p-4 w-max">
      <p className="sm:text-3xl text-xl text-center p-4">{text}</p>
      <div className="flex gap-4 justify-evenly">
        <Button color={btns[1].color} onClick={onClose}>
          {btns[1].text}
        </Button>
        <Button color={btns[0].color} onClick={onConfirm}>
          {btns[0].text}
        </Button>
      </div>
    </div>
  );
};

// declare popup div
const Popup: React.FC<{ popupData: PopupData; onClose: () => void }> = ({
  popupData,
  onClose,
}) => {
  if (!popupData.state) {
    return;
  }

  return (
    <motion.div
      className="w-full h-screen fixed flex justify-center items-center top-0"
      style={{ zIndex: 5 }}
      initial={{ backgroundColor: "#0000" }}
      animate={{
        backgroundColor: "#1116",
        transition: { duration: 0.5 },
      }}
      exit={{
        backgroundColor: "#0000",
        transition: { delay: 0.5, duration: 0.3 },
      }}
    >
      <div
        className="absolute w-full h-full cursor-pointer"
        onClick={onClose}
        style={{ zIndex: -1 }}
      ></div>
      <motion.div
        className="rounded-2xl bg-white flex flex-col gap-4 overflow-hidden"
        initial={{ height: 0 }}
        animate={{
          height: "auto",
          transition: { delay: 0.3, duration: 0.5 },
        }}
        style={{ maxHeight: "85vh" }}
        exit={{ height: 0, transition: { duration: 0.5 } }}
      >
        {popupData.state == "data edit" ? (
          <EditData defaultData={popupData.defaultData} onClose={onClose} />
        ) : popupData.state === "dates edit" ? (
          <EditDates
            onClose={onClose}
            defaultDates={popupData.dates.map((date) => ({
              day: date.day,
              starts:
                convertEgyptTimeToLocalTime(date.starts.slice(0, -3)) + ":00",
              delay: (hrNumber(secondsToHrs(date.delay)) + ":00").slice(1),
            }))}
          />
        ) : popupData.state === "subscribe" && !popupData.defaultData ? (
          <Subscribe id={popupData.id} onClose={onClose} />
        ) : popupData.state === "change" ? (
          <Subscribe id={popupData.id} change onClose={onClose} />
        ) : (
          regulerConfirm({
            ...(popupData.state === "delete"
              ? {
                  text: "هل أنت متأكد من أنك تريد حذف هذا الطالب ؟",
                  onConfirm: () => {},
                  btns: [{ text: "حذف", color: "red" }, { color: "green" }],
                }
              : popupData.state === "subscribe"
              ? {
                  text: "هل أنت متأكد من الإشتراك لهذا الطالب ؟",
                  onConfirm: () => {},
                  btns: [{ text: "إشتراك" }, {}],
                }
              : {
                  text: "هل أنت متأكد من أنك تريد إلغاء إشتراك هذا الطالب ؟",
                  onConfirm: () => {},
                  btns: [{ text: "إلغاء الإشتراك" }, {}],
                }),
            onClose,
          })
        )}
      </motion.div>
    </motion.div>
  );
};

const Content = () => {
  // crete response state
  const [response, setResponse] = useState<responset>();
  const { id }: { id: string } = useParams();
  // create load state
  const [loaded, setLoaded] = useState(false);
  // create popup state
  const [popup, setPopup] = useState<PopupData>({});

  useEffect(() => {
    setResponse({
      succes: true,
      dates: [
        {
          day: "sunday",
          starts: "07:00:00",
          delay: 1800,
          price: 50,
        },
        {
          day: "tuesday",
          starts: "07:00:00",
          delay: 1800,
          price: 50,
        },
        {
          day: "thurusday",
          starts: "07:00:00",
          delay: 1800,
          price: 50,
        },
      ],
      gender: "male",
      name: "محمد بلال",
      note: {
        date: "27/11/2023",
        day: "sunday",
        discription: "إلخ إلخ إلخ\ngggg\nggg",
        rate: 9,
        teacher: "محمود جمال",
      },
      phone: "201283410254",
      subscribed: true,
      teacher: "محمد بلال",
      userType: "superadmin",
      currency: "EGP",
    });
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (popup.state) {
      get<HTMLBodyElement>("html")[0].classList.add("overflow-y-hidden");
    } else {
      get<HTMLBodyElement>("html")[0].classList.remove("overflow-y-hidden");
    }
  }, [popup]);

  useEffect(() => {
    if (response && response.succes) {
      get<HTMLTitleElement>("title", 0, 0).forEach((title) => {
        title.innerHTML = `الطالب ${response.name} - أكاديمية تزود`;
      });
    }
  }, [response]);

  return (
    <ArabicLayout>
      <LoadingDiv loading={!loaded} />

      {response ? (
        response.succes ? (
          <>
            <main className="sm:px-8 sm:py-4 py-2">
              <section className={classes["section"] + "p-4 mb-2"}>
                {/* dispaly name */}
                <h1
                  className={`sm:text-4xl text-2xl font-bold mb-4${
                    response.userType !== "admin"
                      ? " flex items-center justify-between"
                      : ""
                  }`}
                >
                  {response.userType !== "admin" ? (
                    <>
                      <span>{response.name}</span>
                      <span
                        className={
                          "p-2 rounded-full border-2 border-solid border-gray-500 " +
                          "duration-300 cursor-pointer hover:text-white " +
                          `transition-all ${
                            response.userType === "self"
                              ? "hover:bg-sky-600 hover:border-sky-600"
                              : "hover:bg-red-600 hover:border-red-600"
                          }`
                        }
                        title={response.userType === "self" ? "تعديل" : "حذف"}
                        onClick={() =>
                          setPopup(
                            response.userType === "self"
                              ? {
                                  state: "data edit",
                                  defaultData: {
                                    currency: response.currency,
                                    name: response.name,
                                    gender: response.gender,
                                  },
                                }
                              : { state: "delete", id }
                          )
                        }
                      >
                        {response.userType === "self" ? (
                          <PencilIcon width={20} />
                        ) : (
                          <TrashIcon width={20} />
                        )}
                      </span>
                    </>
                  ) : (
                    response.name
                  )}
                </h1>
                {/* display phone number */}
                <h2 className="sm:text-3xl text-xl mt-4 font-bold">
                  <span dir="ltr">+{response.phone}</span>
                </h2>
                {/* dispaly subscribing */}
                <div className="flex gap-8 items-center">
                  <p className="text-2xl my-4">
                    {response.subscribed ? "مشترك" : "غير مشترك"}
                  </p>
                  {/* subscribe button */}
                  {response.subscribed ? (
                    response.userType === "superadmin" && (
                      <button
                        className={
                          "p-2 border-2 border-red-500 bg-red-200 " +
                          "hover:text-white hover:bg-red-500 border-solid " +
                          "rounded-lg transition-all duration-300"
                        }
                        onClick={() => setPopup({ state: "desubscribe", id })}
                      >
                        الغاء الإشتراك
                      </button>
                    )
                  ) : response.userType === "self" ? (
                    // if self display the link to subscribe page
                    <Link
                      href=""
                      className={
                        "p-2 border-2 border-green-500 bg-green-200 " +
                        "hover:text-white hover:bg-green-500 border-solid " +
                        "rounded-lg transition-all duration-300 flex items-center"
                      }
                    >
                      إشتراك
                    </Link>
                  ) : (
                    // else display button that make request to subscribing url
                    <button
                      className={
                        "p-2 border-2 border-green-500 bg-green-200 " +
                        "hover:text-white hover:bg-green-500 border-solid " +
                        "rounded-lg transition-all duration-300"
                      }
                      onClick={() =>
                        setPopup({
                          state: "subscribe",
                          id,
                          defaultData: Boolean(response.teacher),
                        })
                      }
                    >
                      إشتراك
                    </button>
                  )}
                </div>
                {/* display the teacher */}
                <p className="text-xl mb-2">
                  المعلم:{" "}
                  {!response.teacher && response.subscribed ? (
                    // if there isn't teacher and is subscribed color by red
                    <span className="text-red-500">لا يوجد</span>
                  ) : (
                    // else keep it black
                    response.teacher || "لا يوجد"
                  )}
                </p>
                {response.userType !== "self" && response.subscribed && (
                  // if the user is admin or super admin display change teacher button
                  <div>
                    <button
                      className={
                        "p-2 border-2 border-sky-500 bg-sky-200 " +
                        "hover:text-white hover:bg-sky-500 border-solid " +
                        "rounded-lg transition-all duration-300 my-2"
                      }
                      onClick={() =>
                        setPopup({
                          state: "change",
                          id,
                        })
                      }
                    >
                      {response.teacher ? "تغيير المعلم" : "إختيار معلم"}
                    </button>
                    {!response.teacher && (
                      // if subscribed push him
                      <span className="inline-block mr-4">يجب عليك هذا</span>
                    )}
                  </div>
                )}
              </section>
              <section className={classes["section"] + "p-4 my-2 w-auto"}>
                <p className="text-3xl mb-4">المواعيد</p>
                <div className="w-full overflow-x-auto">
                  <table className="overflow-x-scroll w-full">
                    <thead>
                      <tr>
                        <th className={classes["td"]}>اليوم</th>
                        <th className={classes["td"]}>يبدأ</th>
                        <th className={classes["td"]}>المدة</th>
                        <th className={classes["td"]}>السعر</th>
                      </tr>
                    </thead>
                    <tbody>
                      {response.dates.map((date, i) => (
                        <tr key={i}>
                          <td className={classes["td"]}>{arDay(date.day)}</td>
                          <td className={classes["td"]}>
                            {convertEgyptTimeToLocalTime(
                              date.starts.slice(0, -3)
                            )}
                          </td>
                          <td className={classes["td"]}>
                            {hrNumber(secondsToHrs(date.delay))}
                          </td>
                          <td className={classes["td"]}>
                            {date.price}{" "}
                            {response.currency === "EGP"
                              ? "جنيه مصري"
                              : "دولار أمريكي"}{" "}
                            شهريًا
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className={classes["td"]}>الإجمالي</td>
                        <td colSpan={3} className={classes["td"]}>
                          {sum(response.dates.map(({ price }) => price))}{" "}
                          {response.currency === "EGP"
                            ? "جنيه مصري"
                            : "دولار أمريكي"}{" "}
                          شهريًا
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <button
                  className={
                    "p-4 border-2 w-full border-green-500 bg-green-200 " +
                    "hover:text-white hover:bg-green-500 border-solid " +
                    "rounded-lg transition-all duration-300 mt-5"
                  }
                  onClick={() =>
                    setPopup({ state: "dates edit", dates: response.dates })
                  }
                >
                  تعديل
                </button>
              </section>
              <section className={classes["section"] + "mt-2 overflow-hidden"}>
                <div className="p-4">
                  <div className="flex justify-between">
                    <p className="sm:text-2xl">
                      {`${arDay(response.note.day)}  ${response.note.date}`}
                    </p>
                    <p className="sm:text-2xl">
                      {response.note.rate}\
                      <span className="sm:text-lg text-sm">10</span>
                    </p>
                  </div>
                  <div className="p-4">
                    {response.note.discription
                      ? response.note.discription.split("\n").map((line, i) => (
                          <p key={i} className="sm:text-xl my-2">
                            {line.trim()}
                          </p>
                        ))
                      : "لم يتم كتابة تقرير"}
                  </div>
                  <p className="sm:text-2xl text-lg">
                    المعلم: {response.note.teacher}
                  </p>
                </div>
                <Link
                  href={`/students/student/${id}/notes`}
                  className={
                    "border-t-2 border-solid border-gray-600 block " +
                    "p-4 text-center hover:bg-gray-200 transition-all duration-300"
                  }
                >
                  إظهار الكل
                </Link>
              </section>
            </main>
            <AnimatePresence mode="wait">
              {Popup({
                popupData: popup,
                onClose: () => {
                  setPopup({});
                },
              })}
              /
            </AnimatePresence>
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
