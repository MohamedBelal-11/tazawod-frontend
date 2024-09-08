"use client";
import { secondsToHrs } from "@/app/ar/content";
import { arDay } from "@/app/utils/arabic";
import { get } from "@/app/utils/docQuery";
import { sum } from "@/app/utils/number";
import { objCompare } from "@/app/utils/object";
import { almightyTrim, arCharsList, charsList } from "@/app/utils/string";
import { MeetDate, Weekday } from "@/app/utils/students";
import {
  bDate,
  convertEgyptTimeToLocalTime,
  convertEgyptWeekdayToLocal,
  days,
  hrNumber,
} from "@/app/utils/time";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import EditDates from "./editDates";
import Button, { getClass } from "@/app/components/button";
import "@/app/ar/auth/register/student/page.css";
import P, { RegulerConfirm } from "@/app/components/popup";
import { useScrollContext } from "@/app/contexts/scrollerContext";
import LoadingDiv from "@/app/components/loadingDiv";
import {
  DefaultResponse,
  fetchResponse,
  fetchPost,
} from "@/app/utils/response";
import Forbidden from "@/app/forbidden";
import NotFound from "@/app/not-found";
import { StudentNoteAdmin } from "@/app/utils/note";

interface Tdate extends MeetDate {
  price: number;
}

const changefTeacher = ({
  gmail,
  setResponse,
  id,
  change,
  onClose,
  refetch,
}: {
  setResponse: React.Dispatch<
    React.SetStateAction<DefaultResponse | undefined>
  >;
  gmail: string;
  id: string;
  change: boolean;
  onClose: () => void;
  refetch: () => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  fetchPost({
    data: { gmail },
    setResponse,
    url: `/users/${change ? "changeteacher" : "subscribeteacher"}/${id}/`,
    onFinish() {
      setTimeout(() => {
        refetch();
        onClose();
      }, 1500);
    },
  });
};

const Subscribe: React.FC<{
  id: string;
  onClose: () => void;
  refetch: () => void;
  change?: boolean;
}> = ({ id, onClose, change = false, refetch }) => {
  const [response, setResponse] = useState<DefaultResponse>();
  const [gmail, setGmail] = useState("");
  const [loading, setLoading] = useState(false);

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
        <p>عنوان البريد المعلم</p>
          <input
            type="text"
            value={gmail}
            onChange={(e) => {
              setGmail(e.target.value);
            }}
            dir="ltr"
            placeholder="البريد الإلكتروني"
            className={classes.inp}
            autoComplete="email"
          />
      </div>
      <div className="flex gap-4 justify-evenly">
        <Button color="red" onClick={onClose}>
          إلغاء
        </Button>
        <Button
          color="green"
          onClick={
            loading
              ? undefined
              : () =>
                  changefTeacher({
                    gmail,
                    change,
                    setResponse,
                    id,
                    onClose,
                    refetch,
                    setLoading,
                  })
          }
        >
          {loading ? (
            <div className="animate-spin border-8 border-gray-400 border-t-gray-600 rounded-full w-5 h-5"></div>
          ) : change ? (
            "تم"
          ) : (
            "إشتراك"
          )}
        </Button>
      </div>
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
            : response.error === 4
            ? "لم يتم إيجاد المعلم"
            : response.error === 5
            ? "لم يتم قبول هذا المعلم"
            : response.error === 7
            ? "مواعيد الطالب وهذا المعلم متداخلة"
            : "حدث خطأٌ ما"}
        </p>
      )}
    </div>
  );
};

const sendEditedData = ({
  data,
  setLoading,
  setResponse,
  onClose,
  refetch,
}: {
  data: { [key: string]: any };
  setResponse: React.Dispatch<
    React.SetStateAction<DefaultResponse | undefined>
  >;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
  onClose: () => void;
}) => {
  fetchPost({
    data,
    setResponse,
    url: "/users/student/editdata/",
    setLoading,
    onFinish() {
      setTimeout(() => {
        onClose();
        refetch();
      }, 1500);
    },
  });
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
    "rounded-lg border-solid max-w-96 w-full outline-0 shadow-xl",
};
// declare response type
type responset =
  | {
      succes: true;
      userType: "self" | "admin" | "superadmin";
      name: string;
      gmail: string;
      subscribed: boolean;
      dates: Tdate[];
      note: StudentNoteAdmin | null;
      gender: "male" | "female";
      teacher: { name: string; id: string } | null;
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
  refetch: () => void;
  subscribed: boolean;
}> = ({ defaultData, onClose, subscribed, refetch }) => {
  // create inputs state
  const [inputs, setInputs] = useState<DataEdit>(defaultData);
  // create message state
  const [message, setMesssage] = useState<{ name: string[] }>({ name: [] });
  const [response, setResponse] = useState<DefaultResponse>();
  const [loading, setLoading] = useState(false);

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
    <form
      className="h-full w-max"
      onSubmit={(e) => {
        e.preventDefault();
        sendEditedData({
          data: { ...inputs, name: almightyTrim(inputs.name) },
          onClose,
          refetch,
          setLoading,
          setResponse,
        });
      }}
    >
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
          onClick={loading ? undefined : onClose}
          className={
            "p-2 border-2 border-red-500 bg-red-200 " +
            "hover:text-white hover:bg-red-500 border-solid " +
            "rounded-lg transition-all duration-300 cursor-pointer"
          }
        >
          إلغاء
        </div>
        {loading ? (
          <Button type="div">
            <div className="animate-spin border-8 border-gray-400 border-t-gray-600 rounded-full w-5 h-5"></div>
          </Button>
        ) : objCompare(
            { ...inputs, name: almightyTrim(inputs.name) },
            defaultData
          ) || message.name.length !== 0 ? (
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
      {response !== undefined && (
        <p
          className={`p-6 bg-${
            response && response.succes ? "green" : "red"
          }-300 border-2 border-${
            response && response.succes ? "green" : "red"
          }-500 rounded-xl mt-4`}
        >
          {response === null
            ? "حدث خطأٌ ما"
            : response.succes
            ? "تم بنجاح"
            : "حدث خطأٌ ما"}
        </p>
      )}
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
      dates: MeetDate[];
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
const Popup: React.FC<{
  popupData: PopupData;
  onClose: () => void;
  refetch: () => void;
}> = ({ popupData, onClose, refetch }) => {
  const router = useRouter();

  return (
    <P onClose={onClose} visible={Boolean(popupData.state)}>
      {popupData.state == "data edit" ? (
        <EditData
          defaultData={popupData.defaultData}
          onClose={onClose}
          subscribed={popupData.id}
          refetch={refetch}
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
          refresh={refetch}
        />
      ) : popupData.state === "subscribe" && !popupData.defaultData ? (
        <Subscribe id={popupData.id} refetch={refetch} onClose={onClose} />
      ) : popupData.state === "change" ? (
        <Subscribe
          id={popupData.id}
          change
          refetch={refetch}
          onClose={onClose}
        />
      ) : (
        <RegulerConfirm
          {...{
            ...(popupData.state === "delete"
              ? {
                  text: "هل أنت متأكد من أنك تريد حذف هذا الطالب ؟",
                  btns: [{ text: "حذف", color: "red" }, { color: "green" }],
                  url: `/users/user/${popupData.id}/delete/`,
                  onConfirm: (succes) => {
                    if (succes) {
                      router.push("/");
                    }
                  },
                }
              : popupData.state === "subscribe"
              ? {
                  text: "هل أنت متأكد من الإشتراك لهذا الطالب ؟",
                  btns: [{ text: "إشتراك" }, {}],
                  url: `/users/student/${popupData.id}/subscribe/`,
                  onConfirm: () => {
                    setTimeout(() => {
                      onClose();
                      refetch();
                    }, 1500);
                  },
                }
              : {
                  text: "هل أنت متأكد من أنك تريد إلغاء إشتراك هذا الطالب ؟",
                  btns: [{ text: "إلغاء الإشتراك" }, {}],
                  url: `/users/student/${popupData.id}/desubscribe/`,
                  onConfirm: () => {
                    setTimeout(() => {
                      onClose();
                      refetch();
                    }, 1500);
                  },
                }),
            onClose,
          }}
        />
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
    setScrollProperties([response]);
  }, [setScrollProperties, response]);

  const refetch = useCallback(() => {
    fetchResponse({ setResponse, url: `/api/students/student/${id}` });
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

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
    return (
      <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
        حدث خطأٌ ما
      </div>
    );
  }

  if (!response.succes) {
    if (response.error === 1) {
      return <Forbidden />;
    }
    if (response.error === 2) {
      return (
        <div className="p-4 bg-white">
          <p className="text-gray-500 text-lg">لم يتم الموافقة عليك بعد</p>
        </div>
      );
    }
    if (response.error === 3) {
      return <NotFound />;
    }
    return (
      <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
        حدث خطأٌ ما
      </div>
    );
  }

  const dates: Tdate[] = response.dates
    .map((date) => {
      const [day, starts] = convertEgyptWeekdayToLocal(date.day, date.starts);
      return { ...date, day, starts };
    })
    .sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day));

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
          {/* display gmail */}
          <h2 className="sm:text-3xl text-xl mt-4 font-bold">
            <span dir="ltr">{response.gmail}</span>
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
              <Link href="/ar/subscribe" className={getClass({})}>
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
            {response.teacher ? (
              <Link
                href={`/ar/teachers/teacher/${response.teacher.id}`}
                className="hover:underline hover:text-green-500"
              >
                {response.teacher.name}
              </Link>
            ) : response.subscribed ? (
              // if there isn't teacher and is subscribed color by red
              <span className="text-red-500">لا يوجد</span>
            ) : (
              // else keep it black
              "لا يوجد"
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
                {dates.map((date, i) => (
                  <tr key={i}>
                    <td className={classes["td"]}>{arDay(date.day)}</td>
                    <td className={classes["td"]}>
                      {date.starts.slice(0, -3)}
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
                لا يمكنك تعديل مواعيدك بعد الإشتراك
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
                    {`${bDate.getFormedDate(response.note.date, {form: "arabic", day: true, time: true})}`}
                  </p>
                  <p className="sm:text-2xl">
                    {response.note.written ? response.note.rate : "-"}\
                    <span className="sm:text-lg text-sm">10</span>
                  </p>
                </div>
                <div className="p-4">
                  {response.note.written
                    ? response.note.description.split("\n").map((line, i) => (
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
                href={`/ar/students/student/${id}/notes`}
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
      <Popup popupData={popup} onClose={() => setPopup({})} refetch={refetch} />
    </>
  );
};

export default Content;
