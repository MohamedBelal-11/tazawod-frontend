"use client";
import Button from "@/app/components/button";
import Popup, { RegulerConfirm } from "@/app/components/popup";
import { secondsToHrs } from "@/app/ar/content";
import { sum } from "@/app/utils/number";
import { objCompare } from "@/app/utils/object";
import { almightyTrim, arCharsList, charsList } from "@/app/utils/string";
import { bDate, hrNumber } from "@/app/utils/time";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import LoadingDiv from "@/app/components/loadingDiv";
import { get } from "@/app/utils/docQuery";
import {
  DefaultResponse,
  fetchPost,
  fetchResponse,
} from "@/app/utils/response";
import Copier from "@/app/components/copier";
import { TeacherNoteAdmin } from "@/app/utils/note";

type Response =
  | {
      succes: true;
      userType: "self" | "admin" | "superadmin";
      name: string;
      gmail: string;
      prefered_time: "morning" | "afternoon" | "night";
      description: string;
      is_accepted: true;
      currency: "EGP" | "USD";
      gender: "male" | "female";
      note: TeacherNoteAdmin | null;
      students: { name: string; delay: number; id: string }[];
    }
  | {
      succes: true;
      userType: "self" | "admin" | "superadmin";
      name: string;
      gmail: string;
      gender: "male" | "female";
      prefered_time: "morning" | "afternoon" | "night";
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
    "rounded-lg border-solid max-w-96 w-full outline-0 shadow-xl ",
};

type DataEdit = {
  name: string;
  gender: "male" | "female";
  currency: "EGP" | "USD";
  prefered_time: "morning" | "afternoon" | "night";
  description: string;
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
    url: "/users/teacher/editdata/",
    setLoading,
    onFinish: () => {
      setTimeout(() => {
        onClose();
        refetch();
      }, 1500);
    },
  });
};

const EditData: React.FC<{
  defaultData: DataEdit;
  onClose: () => void;
  refetch: () => void;
  is_accepted: boolean;
}> = ({ defaultData, onClose, is_accepted, refetch }) => {
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
      className="h-full flex flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        sendEditedData({
          data: {
            ...inputs,
            name: almightyTrim(inputs.name),
            description: inputs.description.trim(),
          },
          onClose,
          refetch,
          setLoading,
          setResponse,
        });
      }}
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
        <p className="mt-6 text-lg">الوفت المفضل</p>
        <div className={classes["inp"] + "flex flex-wrap justify-evenly"}>
          <div>
            <label htmlFor="morning">صباحًا</label>
            <input
              type="radio"
              id="morning"
              checked={inputs.prefered_time === "morning"}
              onChange={() =>
                setInputs((inps) => ({ ...inps, prefered_time: "morning" }))
              }
            />
          </div>
          <div>
            <label htmlFor="afternoon">بعد الظهيرة</label>
            <input
              type="radio"
              id="afternoon"
              checked={inputs.prefered_time === "afternoon"}
              onChange={() =>
                setInputs((inps) => ({ ...inps, prefered_time: "afternoon" }))
              }
            />
          </div>
          <div>
            <label htmlFor="night">مساءً</label>
            <input
              type="radio"
              id="night"
              checked={inputs.prefered_time === "night"}
              onChange={() =>
                setInputs((inps) => ({ ...inps, prefered_time: "night" }))
              }
            />
          </div>
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
      </div>
      <div className="flex p-2 border-t-2 border-solid border-gray-600 justify-evenly">
        <Button color="red" className="cursor-pointer" onClick={onClose}>
          إلغاء
        </Button>
        {loading ? (
          <Button type="div">
            <div className="animate-spin border-8 border-gray-400 border-t-gray-600 rounded-full w-5 h-5"></div>
          </Button>
        ) : objCompare(
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
  const router = useRouter();

  const closePopup = () => setPopup(undefined);

  const refetch = useCallback(() => {
    fetchResponse({
      setResponse,
      url: `/api/teachers/teacher/${id}/`,
    });
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (response && response.succes) {
      get<HTMLTitleElement>("title").forEach((title) => {
        title.innerHTML = `صفحة المعلم ${response.name} - أكاديمية تزوَد`;
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
    return (
      <div className="m-6 p-6 justify-center items-center flex bg-white rounded-lg">
        حدث خطأٌ ما
      </div>
    );
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
                      response.userType === "self" ? "edit data" : "delete"
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
          <div>
            <Copier copy={response.gmail} arabic />
          </div>
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
              {response.is_accepted ? "موافق عليه" : "غير موافق عليه"}
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
          <p className="text-2xl my-4">
            الوقت المفضل:{" "}
            {response.prefered_time === "morning"
              ? "صباحًا"
              : response.prefered_time === "afternoon"
              ? "بعد الظهيرة"
              : "مساءُ"}
          </p>
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
              {response.students.length === 0 ? (
                <div className="p-8 flex justify-center">
                  لا يوجد أي طلاب لهذا المعلم
                </div>
              ) : (
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
                              href={`/ar/students/student/${student.id}`}
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
                              response.students.map((student) => student.delay)
                            )
                          )
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}
        {response.is_accepted && (
          <section className={classes["section"] + "mt-2 overflow-hidden"}>
            {response.note ? (
              response.note.written ? (
                <>
                  <div className="p-4">
                    <div className="flex justify-between">
                      <p className="sm:text-2xl">
                        {`${bDate.getFormedDate(response.note.date, {form: "arabic", day: true, time: true})}`}
                      </p>
                      <p className="sm:text-2xl">
                        {response.note.rate}\
                        <span className="sm:text-lg text-sm">10</span>
                      </p>
                    </div>
                    <div className="p-4">
                      {response.note.description.split("\n").map((line, i) => (
                        <p key={i} className="sm:text-xl my-2">
                          {line.trim()}
                        </p>
                      ))}
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
                    href={`/ar/teachers/teacher/${id}/notes`}
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
                        {`${bDate.getFormedDate(response.note.date, {form: "arabic", day: true, time: true})}`}
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
                    href={`/ar/teachers/teacher/${id}/notes`}
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
              prefered_time: response.prefered_time,
            }}
            refetch={refetch}
            onClose={closePopup}
            is_accepted={response.is_accepted}
          />
        ) : (
          <RegulerConfirm
            {...{
              ...(popup === "delete"
                ? {
                    text: "هل أنت متأكد من أنك تريد حذف هذا المعلم ؟",
                    url: `/users/user/${id}/delete/`,
                    onConfirm(succes) {
                      if (succes) {
                        router.push("/");
                      }
                    },
                    btns: [{ text: "حذف", color: "red" }, { color: "green" }],
                  }
                : popup === "accept"
                ? {
                    text: "هل أنت متأكد من الموافقة على المعلم ؟",
                    url: `/users/teacher/${id}/accept/`,
                    onConfirm() {
                      setTimeout(() => {
                        closePopup();
                        refetch();
                      }, 1500);
                    },
                    btns: [{ text: "موافقة" }, {}],
                  }
                : {
                    text: "هل أنت متأكد من أنك تريد رفض المعلم ؟",
                    url: `/users/teacher/${id}/deaccept/`,
                    onConfirm() {
                      setTimeout(() => {
                        closePopup();
                        refetch();
                      }, 1500);
                    },
                    btns: [{ text: "رفض", color: "red" }, { color: "green" }],
                  }),
              onClose: closePopup,
            }}
          />
        )}
      </Popup>
    </>
  );
};

export default Content;
