"use client";
import { secondsToHrs } from "@/app/ar/content";
import { get } from "@/app/utils/docQuery";
import { sum } from "@/app/utils/number";
import { objCompare } from "@/app/utils/object";
import { almightyTrim, arCharsList, capitelize, charsList } from "@/app/utils/string";
import { Date, Weekday } from "@/app/utils/students";
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

interface Tdate extends Date {
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
        {change ? "Choose teacher" : "Subscribe to the student"}
      </p>
      <div className="w-full flex flex-col items-center gap-2">
        <p>Teacher{"'"}s email</p>
        <input
          type="text"
          value={gmail}
          onChange={(e) => {
            setGmail(e.target.value);
          }}
          dir="ltr"
          placeholder="Email"
          className={classes.inp}
          autoComplete="email"
        />
      </div>
      <div className="flex gap-4 justify-evenly">
        <Button color="red" onClick={onClose}>
          cancel
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
            "done"
          ) : (
            "subscribe"
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
            ? "Something went wrong."
            : response.succes
            ? "Successfully done."
            : response.error === 4
            ? "Teacher not found."
            : response.error === 5
            ? "This teacher is not accepted."
            : response.error === 7
            ? "The student's and this teacher's schedules overlap."
            : "Something went wrong."}
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
      note: {
        teacher: { name: string; id: string };
        rate: number;
        discription: string | null;
        date: string;
      } | null;
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
        return [...m, "Please fill in the name field."];
      });
    }

    for (let c of almightyTrim(name)) {
      if (![...arCharsList, ...charsList, " "].includes(c)) {
        alive = false;
        setName((m) => {
          return [
            ...m,
            "The name must contain only English or Arabic letters.",
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
          {subscribed ? "You cannot change your gender after subscribing." : "gender"}
        </p>
        <div className={classes["inp"] + "flex flex-wrap"}>
          <div>
            <label htmlFor="male">Male</label>
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
            <label htmlFor="female">Female</label>
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
        <p className="mt-6 text-lg">currency</p>
        <div className={classes["inp"] + "flex flex-wrap"}>
          <div>
            <label htmlFor="EGP">EGP</label>
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
            <label htmlFor="USD">USD</label>
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
          cancel
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
            edit
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
            edit
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
            ? "Something went wrong."
            : response.succes
            ? "Successfully done"
            : "Something went wrong."}
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
                  text: "Are you sure you want to delete this student?",
                  btns: [{ text: "delete", color: "red" }, {text: "cancel" , color: "green" }],
                  url: `/users/user/${popupData.id}/delete/`,
                  onConfirm: (succes) => {
                    if (succes) {
                      router.push("/");
                    }
                  },
                }
              : popupData.state === "subscribe"
              ? {
                  text: "Are you sure you want to subscribe to this student?",
                  btns: [{ text: "subscribe" }, { text: "cancel" }],
                  url: `/users/student/${popupData.id}/subscribe/`,
                  onConfirm() {
                    setTimeout(() => {
                      onClose();
                      refetch();
                    }, 1500);
                  },
                }
              : {
                  text: "Are you sure you want to unsubscribe this student?",
                  btns: [{ text: "unsubscribe" }, { text: "cancel" }],
                  url: `/users/student/${popupData.id}/desubscribe/`,
                  onConfirm() {
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
        title.innerHTML = `Student ${response.name} - Tazawad Academy`;
      });
    }
  }, [response]);

  if (response === undefined) {
    return <LoadingDiv english loading />;
  }

  if (response === null) {
    return (
      <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
        Something went wrong.
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
        Something went wrong.
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
                  title={response.userType === "self" ? "edit" : "delete"}
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
              {response.subscribed ? "subscribed" : "unsubscribed"}
            </p>
            {/* subscribe button */}
            {response.subscribed ? (
              response.userType === "superadmin" && (
                <Button
                  color="red"
                  onClick={() => setPopup({ state: "desubscribe", id })}
                >
                  unsubscribe
                </Button>
              )
            ) : response.userType === "self" ? (
              // if self display the link to subscribe page
              <Link href="/ar/subscribe" className={getClass({})}>
                subscribe
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
                subscribe
              </Button>
            )}
          </div>
          {/* display the teacher */}
          <p className="text-xl mb-2">
            teacher:{" "}
            {response.teacher ? (
              <Link
                href={`/ar/teachers/teacher/${response.teacher.id}`}
                className="hover:underline hover:text-green-500"
              >
                {response.teacher.name}
              </Link>
            ) : response.subscribed ? (
              // if there isn't teacher and is subscribed color by red
              <span className="text-red-500">nothing</span>
            ) : (
              // else keep it black
              "nothing"
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
                {response.teacher ? "Change teacher" : "Select teacher"}
              </Button>
              {!response.teacher && (
                // if subscribed push him
                <span className="inline-block mr-4">You should do this</span>
              )}
            </div>
          )}
        </section>
        <section className={classes["section"] + "p-4 my-2 w-auto"}>
          <p className="text-3xl mb-4">Appointments</p>
          <div className="w-full overflow-x-auto">
            <table className="overflow-x-scroll w-full">
              <thead>
                <tr>
                  <th className={classes["td"]}>Day</th>
                  <th className={classes["td"]}>Starts at</th>
                  <th className={classes["td"]}>Duration</th>
                  <th className={classes["td"]}>Price</th>
                </tr>
              </thead>
              <tbody>
                {dates.map((date, i) => (
                  <tr key={i}>
                    <td className={classes["td"]}>{capitelize(date.day)}</td>
                    <td className={classes["td"]}>
                      {date.starts.slice(0, -3)}
                    </td>
                    <td className={classes["td"]}>
                      {hrNumber(secondsToHrs(date.delay))}
                    </td>
                    <td className={classes["td"]}>
                      {date.price}{" "}
                      {response.currency}{" "}
                      monthly
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className={classes["td"]} colSpan={2}>
                    total
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
                    {response.currency}{" "}
                    monthly
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
                You cannot change your appointments after subscribing.
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
                edit
              </Button>
            ))}
        </section>
        <section className={classes["section"] + "mt-2 overflow-hidden"}>
          {response.note ? (
            <>
              <div className="p-4">
                <div className="flex justify-between">
                  <p className="sm:text-2xl">
                    {`${bDate.getFormedDate(response.note.date, {form: "arabic", day: true, time: false})}`}
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
                    : "No report written"}
                </div>
                <p className="sm:text-2xl text-lg">
                  Teacher:{" "}
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
                Show all
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
