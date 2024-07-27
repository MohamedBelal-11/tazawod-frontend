"use client";
import ArabicLayout from "@/app/components/arabicLayout";
import Button, { getClass } from "@/app/components/button";
import LoadingDiv from "@/app/components/loadingDiv";
import Popup, { regulerConfirm } from "@/app/components/popup";
import { secondsToHrs } from "@/app/content";
import { arDay } from "@/app/utils/arabic";
import { sum } from "@/app/utils/number";
import { objCompare } from "@/app/utils/object";
import { almightyTrim, arCharsList, charsList } from "@/app/utils/string";
import { Weekday } from "@/app/utils/students";
import { hrNumber } from "@/app/utils/time";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Response =
  | {
      succes: true;
      userType: "self" | "admin" | "superadmin";
      name: string;
      phone: string;
      perefered_time: "morning" | "afternoon" | "night";
      description: string;
      is_accepted: true;
      currency: "EGP" | "USD";
      gender: "male" | "female";
      note:
        | {
            written: true;
            student: { name: string; id: string };
            rate: number;
            discription: string;
            day: Weekday;
            date: string;
          }
        | {
            written: false;
            student: { name: string; id: string };
            day: Weekday;
            date: string;
          }
        | null;
      students: { name: string; delay: number; id: string }[];
    }
  | {
      succes: true;
      userType: "self" | "admin" | "superadmin";
      name: string;
      phone: string;
      gender: "male" | "female";
      perefered_time: "morning" | "afternoon" | "night";
      description: string;
      is_accepted: false;
      currency: "EGP" | "USD";
    }
  | {
      succes: false;
      error: number;
    }
  | null;

const classes: { [key: string]: string } = {
  td: "sm:text-2xl border-2 border-solid border-gray-500 sm:p-4 p-1 text-center",
  section: "rounded-xl bg-white border-4 border-solid border-gray-500 ",
  inp:
    "p-2 text-lg border-2 border-gray-300 focus:border-sky-500 " +
    "rounded-lg border-solid max-w-96 w-full outline-0 shadow-3xl ",
};

type DataEdit = {
  name: string;
  gender: "male" | "female";
  currency: "EGP" | "USD";
  description: string;
};

const EditData: React.FC<{
  defaultData: DataEdit;
  onClose: () => void;
  is_accepted: boolean;
}> = ({ defaultData, onClose, is_accepted }) => {
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
    <form
      className="h-full flex flex-col"
      onSubmit={(e) => e.preventDefault()}
      style={{ maxWidth: 800, maxHeight: "85vh", width: "calc(100vw - 40px)" }}
    >
      <div
        className="overflow-y-auto p-4 flex flex-col items-center h-full w-full"
        style={{ flexGrow: 1 }}
      >
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
        <textarea
          onChange={(e) =>
            setInputs((inps) => ({ ...inps, description: e.target.value }))
          }
          className={classes["inp"] + "mt-4"}
          value={inputs.description}
          style={{ maxWidth: "none" }}
        ></textarea>
        <p className="mt-6 text-lg">
          {is_accepted ? "لا يمكنك تغيير جنسك بعد القبول" : "الجنس"}
        </p>
        <div className={classes["inp"] + "flex flex-wrap justify-evenly"}>
          <div>
            <label htmlFor="male">ذكر</label>
            <input
              type="radio"
              id="male"
              checked={inputs.gender === "male"}
              onChange={() =>
                setInputs((inps) => ({ ...inps, gender: "male" }))
              }
              disabled={is_accepted}
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
              disabled={is_accepted}
            />
          </div>
        </div>
        <p className="mt-6 text-lg">العملة</p>
        <div className={classes["inp"] + "flex flex-wrap justify-evenly"}>
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
        <Button color="red" className="cursor-pointer" onClick={onClose}>
          إلغاء
        </Button>
        {objCompare(
          { ...inputs, name: almightyTrim(inputs.name) },
          defaultData
        ) ? (
          <Button color="gray" type="div" textHov="black">
            تعديل
          </Button>
        ) : (
          <Button color="green" type="submit">
            تعديل
          </Button>
        )}
      </div>
    </form>
  );
};

const Content: React.FC = () => {
  const [response, setResponse] = useState<Response>();
  const { id }: { id: string } = useParams();
  const [popup, setPopup] = useState<
    "edit data" | "delete" | "accept" | "fire"
  >();

  const closePopup = () => setPopup(undefined);

  useEffect(() => {
    setResponse({
      succes: true,
      description: almightyTrim(`
        بسم الله الرحمن الرحيم 
        إن الحمد لله نحمده ونستعين به
      `),
      is_accepted: true,
      name: "محمد علي",
      perefered_time: "afternoon",
      phone: "201250344450",
      gender: "male",
      students: [
        { name: "محمد بلال", delay: 3600, id: "aaaa" },
        { name: "عمر علاءالدين", delay: 7200, id: "aaab" },
        { name: "علي خالد علي", delay: 5400, id: "aaac" },
      ],
      // note: {
      //   written: true,
      //   date: "27/11/2023",
      //   day: "sunday",
      //   discription: "إلخ إلخ إلخ\ngggg\nggg",
      //   rate: 9,
      //   student: { name: "محمود جمال", id: "aaaa" },
      // },
      note: null,
      userType: "superadmin",
      currency: "EGP",
    });
  }, []);

  return (
    <ArabicLayout>
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
                              ? "edit data"
                              : "delete"
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
                {/* display description */}
                <p className="sm:text-xl text-md ps-2">
                  {response.description.split("\n").map((line, i) => (
                    <span key={i} className="block py-1">
                      {line}
                    </span>
                  ))}
                </p>

                {/* dispaly is_accepted */}
                <div className="flex gap-8 items-center">
                  <p className="text-2xl my-4">
                    {response.is_accepted ? "موافق عليع" : "غير موافق عليع"}
                  </p>
                  {/* accept button */}
                  {response.userType === "superadmin" &&
                    (response.is_accepted ? (
                      <Button color="red" onClick={() => setPopup("fire")}>
                        الغاء الموافقة
                      </Button>
                    ) : (
                      <Button color="green" onClick={() => setPopup("accept")}>
                        موافقة
                      </Button>
                    ))}
                </div>
              </section>
              {response.is_accepted && (
                <section className={classes["section"] + "p-4 my-2 w-auto"}>
                  <p className="sm:text-3xl text-lg mb-4 flex items-center gap-2">
                    <span>الطلبة</span>
                    <span className="bg-green-400 rounded-full p-1">
                      {response.students.length}
                    </span>
                  </p>
                  <div className="w-full overflow-x-auto">
                    <table className="overflow-x-scroll w-full">
                      <thead>
                        <tr>
                          <th className={classes["td"]}>الطالب</th>
                          <th className={classes["td"]}>المدة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {response.students.map((student, i) => (
                          <tr key={i}>
                            <td className={classes["td"]}>
                              {response.userType === "self" ? (
                                student.name
                              ) : (
                                <Link
                                  href={`/teachers/teacher/${student.id}`}
                                  className="hover:underline hover:text-green-500"
                                >
                                  {student.name}
                                </Link>
                              )}
                            </td>
                            <td className={classes["td"]}>
                              {hrNumber(secondsToHrs(student.delay))}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td className={classes["td"]}>الإجمالي</td>
                          <td className={classes["td"]}>
                            {hrNumber(
                              secondsToHrs(
                                sum(
                                  response.students.map(
                                    (student) => student.delay
                                  )
                                )
                              )
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
              {response.is_accepted && (
                <section
                  className={classes["section"] + "mt-2 overflow-hidden"}
                >
                  {response.note ? (
                    response.note.written ? (
                      <>
                        <div className="p-4">
                          <div className="flex justify-between">
                            <p className="sm:text-2xl">
                              {`${arDay(response.note.day)}  ${
                                response.note.date
                              }`}
                            </p>
                            <p className="sm:text-2xl">
                              {response.note.rate}\
                              <span className="sm:text-lg text-sm">10</span>
                            </p>
                          </div>
                          <div className="p-4">
                            {response.note.discription
                              ? response.note.discription
                                  .split("\n")
                                  .map((line, i) => (
                                    <p key={i} className="sm:text-xl my-2">
                                      {line.trim()}
                                    </p>
                                  ))
                              : "لم يتم كتابة تقرير"}
                          </div>
                          <p className="sm:text-2xl text-lg">
                            الطالب:{" "}
                            {response.userType === "self" ? (
                              response.note.student.name
                            ) : (
                              <Link
                                href={`/students/student/${response.note.student.id}`}
                                className="hover:underline hover:text-green-500"
                              >
                                {response.note.student.name}
                              </Link>
                            )}
                          </p>
                        </div>
                        <Link
                          href={`/teachers/teacher/${id}/notes`}
                          className={
                            "border-t-2 border-solid border-gray-600 block " +
                            "p-4 text-center hover:bg-gray-200 transition-all duration-300"
                          }
                        >
                          إظهار الكل
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="p-4">
                          <div className="flex justify-between">
                            <p className="sm:text-2xl">
                              {`${arDay(response.note.day)}  ${
                                response.note.date
                              }`}
                            </p>
                            <p className="sm:text-2xl">
                              -\
                              <span className="sm:text-lg text-sm">10</span>
                            </p>
                          </div>
                          <div className="p-4">لم يتم كتابة تقرير</div>
                          <p className="sm:text-2xl text-lg">
                            الطالب:{" "}
                            {response.userType === "self" ? (
                              response.note.student.name
                            ) : (
                              <Link
                                href={`/students/student/${response.note.student.id}`}
                                className="hover:underline hover:text-green-500"
                              >
                                {response.note.student.name}
                              </Link>
                            )}
                          </p>
                        </div>
                        <Link
                          href={`/teachers/teacher/${id}/notes`}
                          className={
                            "border-t-2 border-solid border-gray-600 block " +
                            "p-4 text-center hover:bg-gray-200 transition-all duration-300"
                          }
                        >
                          إظهار الكل
                        </Link>
                      </>
                    )
                  ) : (
                    <div className="h-80 flex justify-center items-center">
                      <p>لم يحضر أي مقابلات بعد</p>
                    </div>
                  )}
                </section>
              )}
            </main>
            <Popup onClose={closePopup} visible={Boolean(popup)}>
              {popup === "edit data" ? (
                <EditData
                  defaultData={{
                    name: response.name,
                    currency: response.currency,
                    description: response.description,
                    gender: response.gender,
                  }}
                  onClose={closePopup}
                  is_accepted={response.is_accepted}
                />
              ) : (
                regulerConfirm({
                  ...(popup === "delete"
                    ? {
                        text: "هل أنت متأكد من أنك تريد حذف هذا المعلم ؟",
                        onConfirm: () => {},
                        btns: [
                          { text: "حذف", color: "red" },
                          { color: "green" },
                        ],
                      }
                    : popup === "accept"
                    ? {
                        text: "هل أنت متأكد من الموافقة على المعلم ؟",
                        onConfirm: () => {},
                        btns: [{ text: "موافقة" }, {}],
                      }
                    : {
                        text: "هل أنت متأكد من أنك تريد رفض المعلم ؟",
                        onConfirm: () => {},
                        btns: [
                          { text: "رفض", color: "red" },
                          { color: "green" },
                        ],
                      }),
                  onClose: closePopup,
                })
              )}
            </Popup>
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
