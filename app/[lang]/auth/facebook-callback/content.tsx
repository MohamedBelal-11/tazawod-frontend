/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchPost } from "@/app/utils/response";
import { AnimatePresence, motion } from "framer-motion";
import { CreateDate, MetaInfo } from "../register/student/content";
import { useLayoutContext } from "@/app/contexts/arabicLayoutContext";
import { get } from "@/app/utils/docQuery";
import { almightyTrim, arCharsList, charsList } from "@/app/utils/string";
import { convertLocalWeekdayToEgypt, days, isBetween } from "@/app/utils/time";
import { backendUrl } from "@/app/utils/auth";
import axios from "axios";
import { Weekday } from "@/app/utils/students";
import { arDay } from "@/app/utils/arabic";

type Responset =
  | {
      succes: true;
      completed: true;
      token: string;
    }
  | {
      succes: false;
      error: number;
    }
  | {
      succes: true;
      completed: false;
      name: string;
    }
  | null;

const Content: React.FC<{lang: string}> = ({lang}) => {
  const [response, setResponse] = useState<Responset>();
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const accessToken = new URLSearchParams(hash.substring(1)).get(
      "access_token"
    );

    fetchPost({
      setResponse,
      url: "/users/facebook/login/",
      data: { access_token: accessToken },
    });
  }, []);
  if (response === undefined) return <div>جاري التسجيل...</div>;
  if (response === null) return <div>حدث خطأ ما</div>;
  if (response.succes) {
    if (response.completed) {
      localStorage.setItem("token", response.token);
      router.push(`/${lang}/`);
    } else {
      return <RegisterComponent dname={response.name} lang={lang} />;
    }
  } else {
    return <div>حدث خطأ ما، يرجى المحاولة لاحقاً.</div>;
  }
};


const classes = {
  inp:
    "p-3 text-xl border-2 border-gray-300 focus:border-sky-500 " +
    "rounded-xl border-solid max-w-96 w-full outline-0 shadow-xl",
  genderCard:
    "flex flex-col items-center gap-3 md:p-6 p-2 rounded-xl border-4 border-solid cursor-pointer ",
  genderImg: "w-48",
  genderP: "text-xl",
  lesson:
    "flex flex-col items-start *:bg-sky-500 *:p-2 *:border-b-solid " +
    "*:border-white *:border-2 *:rounded-md *:flex *:items-center",
  createDateCard:
    "flex flex-col items-center gap-3 border-solid border-2 border-gray-400 p-4 rounded-xl",
  craateDateInp:
    "outline-0 border-solid border-2 border-gray-400 p-2 rounded-xl",
};

const RegisterComponent: React.FC<{dname: string;lang: string}> = ({dname, lang}) => {
  const router = useRouter();
  const [name, setName] = useState(dname);
  const [gender, setGender] = useState<"male" | "female">();
  const [quraan_days, setQuraan_days] = useState<MetaInfo[]>([]);
  const [createDate, setCreateDate] = useState<{
    method: Dispatch<SetStateAction<MetaInfo[]>>;
    value: MetaInfo[];
  }>();
  const [message, setMessage] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { setLayoutProperties } = useLayoutContext()!;

  useEffect(() => {
    setLayoutProperties({ className: "pt-4" });
  }, [setLayoutProperties]);

  useEffect(() => {
    if (createDate) {
      get<HTMLBodyElement>("html")[0].classList.add("overflow-y-hidden");
    } else {
      get<HTMLBodyElement>("html")[0].classList.remove("overflow-y-hidden");
    }
  }, [createDate]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      
    const access_token = new URLSearchParams(location.hash.substring(1)).get(
      "access_token"
    );
      const data = {
        access_token,
        name: almightyTrim(name),
        gender: gender,
        quraan_days: quraan_days.map((date) => {
          const [day, starts] = convertLocalWeekdayToEgypt(
            date.day,
            date.starts
          );

          return {
            delay: date.delay,
            starts,
            day,
          };
        }),
      };
      const response = await axios.post(
        backendUrl + "/users/facebook/register/",
        data
      );
      if (response.status === 201) {
          const token = response.data.token;
          // Store the token in local storage or any other secure place
          localStorage.setItem("token", token);
        setMessage(["تم تسجيل الطالب"]);
        setLoading(false);
        router.replace("/");
        
      }
    } catch (error) {
      console.error("Error registering student", error);
      setMessage(["حدث خطأ أثناء تسجيل الطالب: " + error]);
      setLoading(false);
    }
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(() => {
      return [];
    });

    let alive = true;
    let tmpList: [string, string, Weekday][] = [];
    if (name.trim() === "") {
      alive = false;
      setMessage((m) => [...m, "رجاءً قم بملء خانة الإسم"]);
    }

    for (let c of almightyTrim(name)) {
      if (![...arCharsList, ...charsList, " "].includes(c)) {
        alive = false;
        setMessage((m) => [
          ...m,
          "يجب أن يحتوي الاسم على حروف إنجليزية أو عربية فقط (لا تشكيل)",
        ]);
        break;
      }
    }

    if (!gender) {
      alive = false;
      setMessage((m) => {
        return [...m, "يجب أن تحدد جنسك"];
      });
    }

    let alive1 = true;
    let dayslistd: Weekday[] = [];
    for (let list of [quraan_days]) {
      if (list.length === 0) {
        setMessage((m) => {
          return [
            ...m,
            "خانة المواعيد فارغة رجاءً ضع فيها موعد واحد على الأقل",
          ];
        });
        alive = false;
        alive1 = false;
      }
      for (let date of list) {
        if (!alive1) {
          break;
        }
        let [EGday] = convertLocalWeekdayToEgypt(date.day, date.starts);
        for (let day of dayslistd) {
          if (day === EGday) {
            setMessage((m) => {
              return [
                ...m,
                "هناك موعدان في نفس اليوم حسب توقيت مصر قم بتوسيع المسافة بينهما",
              ];
            });
            alive = false;
            alive1 = false;
            break;
          }
        }
        dayslistd.push(EGday);
      }
      for (let date of list.sort(
        (a, b) => days.indexOf(a.day) - days.indexOf(b.day)
      )) {
        if (!alive1) {
          break;
        }

        for (let dateNum of tmpList) {
          if (
            isBetween(
              [date.starts, date.day],
              date.delay,
              [dateNum[0], dateNum[2]],
              dateNum[1]
            )
          ) {
            alive1 = false;
            alive = false;
            setMessage((m) => {
              return [...m, "المواعيد متداخلة رجاءً راجع مواعيدك"];
            });
            break;
          }
        }
        tmpList.push([date.starts, date.delay, date.day]);
      }
    }

    if (alive) {
      handleSubmit();
    }
  };

  return (
    <>
      <div className="md:p-12 p-4" dir={lang === "ar" ? "rtl" : "ltr"}>
        <form
          onSubmit={submit}
          className="flex p-8 rounded-2xl bg-white shadow-2xl flex-col gap-8"
          noValidate
        >
          <h1 className="text-4xl mb-4">إنشاء حساب</h1>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="الاسم"
            className={classes.inp}
            maxLength={30}
            required
            autoComplete="name"
          />
          <h2 className="text-xl">حدد جنسك</h2>
          <div className="flex justify-evenly">
            <div
              className={
                classes.genderCard +
                (gender == "male"
                  ? "border-sky-500 bg-sky-100"
                  : "border-gray-400")
              }
              onClick={() => {
                setGender("male");
              }}
            >
              <img src="/static/imgs/man.png" className={classes.genderImg} />
              <p className={classes.genderP}>ذكر</p>
            </div>
            <div
              className={
                classes.genderCard +
                (gender == "female"
                  ? "border-sky-500 bg-sky-100"
                  : "border-gray-400")
              }
              onClick={() => {
                setGender("female");
              }}
            >
              <img src="/static/imgs/woman.png" className={classes.genderImg} />
              <p className={classes.genderP}>أنثى</p>
            </div>
          </div>
          <h2 className="text-xl">
            مواعيد درس تحفيظ القرءان (مطلوب واحد على الأقل)
          </h2>
          <div className={classes.lesson}>
            {quraan_days.map((date, i) => {
              return (
                <p key={quraan_days.indexOf(date)}>
                  يوم {arDay(date.day)} الساعة {date.starts.slice(0, -3)} لمدة{" "}
                  {date.delay.slice(0, -3)}
                  <div
                    onClick={() => {
                      setQuraan_days(
                        quraan_days.slice(0, i).concat(quraan_days.slice(i + 1))
                      );
                    }}
                    className={
                      "bg-red-500 py-1 px-2 rounded-md mr-2 inline-block " +
                      "text-center cursor-pointer"
                    }
                  >
                    X
                  </div>
                </p>
              );
            })}
          </div>
          {!(quraan_days.length > 6) ? (
            <div
              className="p-3 rounded-xl text-white bg-green-500 text-center cursor-pointer"
              onClick={() => {
                setCreateDate({ method: setQuraan_days, value: quraan_days });
              }}
            >
              إضافة
            </div>
          ) : (
            <></>
          )}

          {message.length !== 0 ? (
            <p className="p-6 rounded-xl border-4 border-solid border-red-500 bg-red-100 flex flex-col gap-2">
              {message.map((fault, i) => {
                return <p key={i}>{fault}</p>;
              })}
            </p>
          ) : (
            <></>
          )}
          {loading ? (
            <div className="p-4 border-solid border-2 border-green-500 rounded-xl bg-green-500 flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                className="w-6 h-6 border-gray-300 border-solid border-4 border-t-sky-500 rounded-full"
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
            </div>
          ) : (
            <input
              type="submit"
              className={
                "p-4 bg-green-200 border-solid border-2 border-green-500 rounded-xl " +
                "hover:bg-green-500 hover:text-white transition-all cursor-pointer"
              }
            />
          )}
        </form>
      </div>
      <AnimatePresence>
        {CreateDate({
          ...createDate,
          closeMethod: () => {
            setCreateDate(undefined);
          },
        })}
      </AnimatePresence>
    </>
  );
};

export default Content;