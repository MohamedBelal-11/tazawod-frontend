"use client";
import { secondsToHrs } from "@/app/ar/content";
import { arDay } from "@/app/utils/arabic";
import { get, stateScroll } from "@/app/utils/docQuery";
import { sum } from "@/app/utils/number";
import { objCompare } from "@/app/utils/object";
import { almightyTrim, arCharsList, charsList } from "@/app/utils/string";
import { Date, Weekday } from "@/app/utils/students";
import { convertEgyptTimeToLocalTime, hrNumber } from "@/app/utils/time";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import EditDates from "./editDates";
import MyPhoneInput from "@/app/components/phoneInput";
import Button, { getClass } from "@/app/components/button";
import "@/app/ar/auth/register/student/page.css";
import P, { regulerConfirm } from "@/app/components/popup";
import { useScrollContext } from "@/app/contexts/scrollerContext";
import LoadingDiv from "@/app/components/loadingDiv";

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
        teacher: { name: string; id: string };
        rate: number;
        discription: string | null;
        day: Weekday;
        date: string;
      } | null;
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
  subscribed: boolean;
}> = ({ defaultData, onClose, subscribed }) => {
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
    <form className="h-full w-max" onSubmit={(e) => e.preventDefault()}>
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
        <p className="mt-6 text-lg">
          {subscribed ? "لا يمكنك تغيير جنسك بعد الإشتراك" : "الجنس"}
        </p>
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
              disabled={subscribed}
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
              disabled={subscribed}
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
      id: boolean;
    };

// declare popup div
const Popup: React.FC<{ popupData: PopupData; onClose: () => void }> = ({
  popupData,
  onClose,
}) => {
  return (
    <P onClose={onClose} visible={Boolean(popupData.state)}>
      {popupData.state == "data edit" ? (
        <EditData
          defaultData={popupData.defaultData}
          onClose={onClose}
          subscribed={popupData.id}
        />
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
    </P>
  );
};

const Content = () => {
  // crete response state
  const [response, setResponse] = useState<responset>();
  const { id }: { id: string } = useParams();
  const { setScrollProperties } = useScrollContext()!;
  // create popup state
  const [popup, setPopup] = useState<PopupData>({});

  useEffect(() => {
    setScrollProperties([popup]);
  }, [setScrollProperties, popup]);

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
        teacher: { name: "محمود جمال", id: "aaaa" },
      },
      phone: "201283410254",
      subscribed: true,
      teacher: "محمد بلال",
      userType: "self",
      currency: "EGP",
    });
  }, []);

  useEffect(() => {
    if (response && response.succes) {
      get<HTMLTitleElement>("title", 0, 0).forEach((title) => {
        title.innerHTML = `الطالب ${response.name} - أكاديمية تزود`;
      });
    }
  }, [response]);

  if (response === undefined) {
    return <LoadingDiv loading />;
  }

  if (response === null) {
    return;
  }

  if (!response.succes) {
    return;
  }

  return (
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
                            id: response.subscribed,
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
                <Button
                  color="red"
                  onClick={() => setPopup({ state: "desubscribe", id })}
                >
                  الغاء الإشتراك
                </Button>
              )
            ) : response.userType === "self" ? (
              // if self display the link to subscribe page
              <Link href="" className={getClass({})}>
                إشتراك
              </Link>
            ) : (
              // else display button that make request to subscribing url
              <Button
                color="green"
                onClick={() =>
                  setPopup({
                    state: "subscribe",
                    id,
                    defaultData: Boolean(response.teacher),
                  })
                }
              >
                إشتراك
              </Button>
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
              <Button
                color="sky"
                onClick={() =>
                  setPopup({
                    state: "change",
                    id,
                  })
                }
              >
                {response.teacher ? "تغيير المعلم" : "إختيار معلم"}
              </Button>
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
                      {convertEgyptTimeToLocalTime(date.starts.slice(0, -3))}
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
                  <td className={classes["td"]} colSpan={2}>
                    الإجمالي
                  </td>
                  <td className={classes["td"]}>
                    {hrNumber(
                      secondsToHrs(
                        sum(response.dates.map((date) => date.delay))
                      )
                    )}
                  </td>
                  <td className={classes["td"]}>
                    {sum(response.dates.map(({ price }) => price))}{" "}
                    {response.currency === "EGP" ? "جنيه مصري" : "دولار أمريكي"}{" "}
                    شهريًا
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {response.userType === "self" &&
            (response.subscribed ? (
              <Button
                color="gray"
                type="div"
                className="w-full mt-4"
                padding={4}
                id="edit-dates-button"
                textHov="black"
              >
                لا يمكنك تعديل |مواعيدك بعد الإشتراك
              </Button>
            ) : (
              <Button
                color="green"
                padding={4}
                onClick={() =>
                  setPopup({ state: "dates edit", dates: response.dates })
                }
                className="w-full mt-4"
                id="edit-dates-button"
              >
                تعديل
              </Button>
            ))}
        </section>
        <section className={classes["section"] + "mt-2 overflow-hidden"}>
          {response.note ? (
            <>
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
                  المعلم:{" "}
                  {response.userType === "self" ? (
                    response.note.teacher.name
                  ) : (
                    <Link
                      href={`/teachers/teacher/${response.note.teacher.id}`}
                      className="hover:underline hover:text-green-500"
                    >
                      {response.note.teacher.name}
                    </Link>
                  )}
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
            </>
          ) : (
            <></>
          )}
        </section>
      </main>
      <Popup popupData={popup} onClose={() => setPopup({})} />
    </>
  );
};

export default Content;
