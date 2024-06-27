/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import ArabicFormLayout from "@/app/components/arabicFormLayout";
import {
  almightyTrim,
  arCharsList,
  charsList,
  numList,
} from "@/app/utils/string";
import { numHours } from "@/app/utils/time";
import axios from "axios";
import { Dispatch, SetStateAction, useRef, useState } from "react";

type metaInfo = { day: string; starts: string; delay: string };

const arDay = (day: string) => {
  if (day === "monday") {
    return "الإثنين";
  }
  if (day === "tuesday") {
    return "الثلاثاء";
  }
  if (day === "wednesday") {
    return "الأربعاء";
  }
  if (day === "thurusday") {
    return "الخميس";
  }
  if (day === "friday") {
    return "الجمعة";
  }
  if (day === "saturday") {
    return "السبت";
  }
  return "الأحد";
};

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thurusday",
  "friday",
  "saturday",
];

const classes = {
  inp: "p-3 text-xl border-2 border-gray-300 focus:border-sky-500 rounded-xl border-solid max-w-96 w-full outline-0 shadow-3xl",
  genderCard:
    "flex flex-col items-center gap-3 p-6 rounded-xl border-4 border-solid cursor-pointer ",
  genderImg: "w-48",
  genderP: "text-xl",
  lesson:
    "flex flex-col items-start *:bg-sky-500 *:p-2 *:border-b-solid *:border-white *:border-2 *:rounded-md *:flex *:items-center",
  createDateCard:
    "flex flex-col items-center gap-3 border-solid border-2 border-gray-400 p-4 rounded-xl",
  craateDateInp:
    "outline-0 border-solid border-2 border-gray-400 p-2 rounded-xl",
};

function CreateDate(props: {
  method?: Dispatch<SetStateAction<metaInfo[]>>;
  value?: metaInfo[];
  closeMethod: () => void;
}) {
  const [start, setStart] = useState("15:00:00");
  const [delay, setDelay] = useState("2:00:00");
  const [red, setRed] = useState(false);
  const [smred, setSmred] = useState(false);

  let selectRef = useRef<HTMLSelectElement>(null);

  if (props.method === undefined || props.value === undefined) {
    return <></>;
  }

  let num = 0;
  let tmp = true;
  let list: string[] = [];

  for (let value of props.value) {
    list.push(value.day);
    if (days[num] === value.day && tmp) {
      num++;
    } else {
      tmp = false;
    }
  }

  const reset = () => {
    setStart("15:00:00");
    setDelay("2:00:00");
  };

  const add = () => {
    if (!red) {
      props.method!([
        ...props.value!,
        { day: selectRef.current?.value!, starts: start, delay: delay },
      ]);
      reset();
      props.closeMethod();
    }
  };

  const cancel = () => {
    reset();
    props.closeMethod();
  };

  return (
    <div
      className="w-full h-screen fixed flex justify-center items-center top-0"
      style={{ backgroundColor: "#1113", zIndex: 2 }}
    >
      <div className="p-6 rounded-2xl bg-white flex flex-col gap-4 max-h-screen overflow-y-scroll">
        <h1 className="text-3xl">إضافة موعد</h1>
        <div className="flex gap-4 flex-wrap justify-center *:flex-grow">
          <div className={classes.createDateCard}>
            <p className="text-2xl">اليوم</p>
            <select
              className={classes.craateDateInp}
              ref={selectRef}
              defaultValue={days[num]}
            >
              {days.map((tDay) => {
                if (list.includes(tDay)) {
                  return <></>;
                }

                return (
                  <option value={tDay} key={tDay}>
                    {arDay(tDay)}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={classes.createDateCard}>
            <p className="text-2xl">
              الساعة بتوقيت{" "}
              <a
                href="https://www.google.com/search?q=%D9%83%D9%85+%D8%A7%D9%84%D8%B3%D8%A7%D8%B9%D8%A9+%D8%A7%D9%84%D8%A7%D9%86+%D9%81%D9%8A+%D9%85%D8%B5%D8%B1"
                className="no-underline hover:underline text-sky-600"
                target="_blank"
              >
                مصر
              </a>
            </p>
            <input
              type="time"
              className={classes.craateDateInp}
              value={start}
              onChange={(e) => {
                setRed(
                  !(
                    (e.target.value.slice(-2) === "00" ||
                      e.target.value.slice(-2) === "30") &&
                    Number(e.target.value.slice(0, -3)) < 23 &&
                    Number(e.target.value.slice(0, -3)) > 9
                  )
                );
                setStart(e.target.value + ":00");
              }}
            />
            <p className={red ? "text-red-500" : undefined}>
              يجب أن تكون الدقائق 30 أو 0<br />
              أما الساعات يجب أن تكون
              <br />
              من 10 صباحًا حتى 10 مساءً
            </p>
          </div>
          <div className={classes.createDateCard}>
            <p className="text-2xl">المدة</p>
            <div className="flex gap-2">
              <div className="flex flex-col items-center">
                <p>الدقائق</p>
                <button
                  onClick={() => {
                    let mins = delay.slice(-5, -3);
                    if (mins === "30" || delay.slice(0, -6) === "3") {
                      setDelay(delay.slice(0, -6) + ":00:00");
                    } else {
                      setDelay(delay.slice(0, -6) + ":30:00");
                    }
                  }}
                  className={classes.craateDateInp}
                >
                  {delay.slice(-5, -3)}
                </button>
              </div>
              <div className="flex flex-col items-center">
                <p>الساعات</p>
                <div className={classes.inp + " flex items-center"}>
                  <p>{delay.slice(0, -6)}</p>
                  <div className="flex flex-col">
                    <button
                      className={classes.craateDateInp + " text-sm"}
                      onClick={() => {
                        if (!(Number(delay.slice(0, -6)) > 2)) {
                          setDelay(
                            delay.slice(0, -6) === "2" ? "3:00:00" :
                            String(Number(delay.slice(0, -6)) + 1) +
                              delay.slice(-6)
                          );
                        }
                      }}
                    >
                      ▲
                    </button>
                    <button
                      className={classes.craateDateInp + " text-sm"}
                      onClick={() => {
                        if (!(Number(delay.slice(0, -6)) < 2)) {
                          setDelay(
                            String(Number(delay.slice(0, -6)) - 1) +
                              delay.slice(-6)
                          );
                        }
                      }}
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            className="p-3 rounded-xl text-white bg-red-500"
            onClick={cancel}
          >
            إلغاء
          </button>
          <button
            className="p-3 rounded-xl text-white bg-green-500"
            onClick={add}
          >
            إضافة
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Content() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [gender, setGender] = useState<"male" | "female">();
  const [quraan_days, setQuraan_days] = useState<metaInfo[]>([]);
  const [feqh_days, setFeqh_days] = useState<metaInfo[]>([]);
  const [suna_days, setSuna_days] = useState<metaInfo[]>([]);
  const [telawa_days, setTelawa_days] = useState<metaInfo[]>([]);
  const [createDate, setCreateDate] = useState<
    | {
        method: Dispatch<SetStateAction<metaInfo[]>>;
        value: metaInfo[];
      }
    | undefined
  >();
  const [message, setMessage] = useState<string[]>([]);

  const handleSubmit = async () => {
    try {
      const data = {
        name: almightyTrim(name),
        email: email.trim(),
        gender: gender,
        password: password,
        quraan_days: quraan_days, // Replace with actual IDs
        feqh_days: feqh_days,
        suna_days: suna_days,
        telawa_days: telawa_days,
      };
      await axios.post("http://127.0.0.1:8000/student/create/", data);
      setMessage([...message, "Student registered successfully"]);
    } catch (error) {
      console.error("Error registering student", error);
      setMessage([...message, "Error registering student: " + String(error)]);
    }
  };

  const submit = () => {
    setMessage(() => {
      return [];
    });
    const marksList = ["!", "@", "#", "$", "%", "^", "&", "*", "?", "_"];
    let alive = true;
    let tmpList: any[][] = [];
    if (name.trim() === "") {
      alive = false;
      setMessage((m) => {
        return [...m, "رجاءً قم بملء خانة الإسم"];
      });
    }

    for (let c of almightyTrim(name)) {
      if (![...arCharsList, ...charsList, " "].includes(c)) {
        alive = false;
        setMessage((m) => {
          return [
            ...m,
            "يجب أن يحتوي الاسم على حروف إنجليزية أو عربية فقط (لا تشكيل)",
          ];
        });
        break;
      }
    }

    if (email.trim() === "") {
      alive = false;
      setMessage((m) => {
        return [...m, "رجاءً قم بملء خانة البريد الإلكتروني"];
      });
    }
    if (!email.trim().endsWith("@gmail.com")) {
      alive = false;
      setMessage((m) => {
        return [
          ...m,
          'يجب أن يكون البريد الإلكتروني عنوان بريد جيميل (ينتهي بـ "@gmail.com")',
        ];
      });
    }

    for (let c of email.trim().slice(0, -10)) {
      if (![...charsList, ...numList].includes(c)) {
        alive = false;
        setMessage((m) => {
          return [
            ...m,
            "يجب أن يحتوي الجيميل على حروف إنجليزية وأرقام فقط (لا مسافات)",
          ];
        });
        break;
      }
    }

    for (let c of password) {
      if (![...charsList, ...numList, ...marksList].includes(c)) {
        alive = false;
        setMessage((m) => {
          return [
            ...m,
            "يجب أن تحتوي كلمة المرور على حروف إنجليزية وبعض هذه الرموز !@#$%^&*_ و أرقام فقط (لا مسافات)",
          ];
        });
        break;
      }
    }

    let alive1 = false;
    for (let c of charsList) {
      if (password.includes(c)) {
        alive1 = true;
        break;
      }
    }

    if (!alive1) {
      alive = false;
      setMessage((m) => {
        return [...m, "يجب أن تحتوي كلمة المرور على حروف إنجليزية"];
      });
    }

    alive1 = false;
    for (let c of numList) {
      if (password.includes(c)) {
        alive1 = true;
        break;
      }
    }

    if (!alive1) {
      alive = false;
      setMessage((m) => {
        return [...m, "يجب أن تحتوي كلمة المرور على أرقام"];
      });
    }

    alive1 = false;
    for (let c of marksList) {
      if (password.includes(c)) {
        alive1 = true;
        break;
      }
    }

    if (!alive1) {
      alive = false;
      setMessage((m) => {
        return [...m, "يجب أن تحتوي كلمة المرور على بعض هذه الرموز !@#$%^&*_"];
      });
    }

    if (password.length < 8) {
      alive = false;
      setMessage((m) => {
        return [...m, "يجب أن تتكون كلمة المرور فيما يقل لا يقل عن 8 أحرف"];
      });
    }

    if (password !== password2) {
      alive = false;
      setMessage((m) => {
        return [...m, "كلمتا المرور غير متطابقان"];
      });
    }

    if (!gender) {
      alive = false;
      setMessage((m) => {
        return [...m, "يجب أن تحدد جنسك"];
      });
    }
    alive1 = true;
    for (let list of [quraan_days, feqh_days, suna_days, telawa_days]) {
      if (list.length === 0) {
        setMessage((m) => {
          return [
            ...m,
            "هناك خانة مواعيد فارغة رجاءً ضع  فيها موعد واحد على الأقل",
          ];
        });
        alive = false;
        break;
      }
      for (let date of list) {
        if (!alive1) {
          break;
        }
        for (let dateNum of tmpList) {
          if (
            (numHours(date.starts) > dateNum[0] &&
              numHours(date.starts) < dateNum[1] &&
              date.day === dateNum[2]) ||
            (numHours(date.starts) + numHours(date.delay) > dateNum[0] &&
              numHours(date.starts) + numHours(date.delay) < dateNum[1] &&
              date.day === dateNum[2]) ||
            (dateNum[0] > numHours(date.starts) &&
              dateNum[0] < numHours(date.starts) + numHours(date.delay) &&
              date.day === dateNum[2]) ||
            (dateNum[1] > numHours(date.starts) &&
              dateNum[1] < numHours(date.starts) + numHours(date.delay) &&
              date.day === dateNum[2]) ||
            (numHours(date.starts) === dateNum[0] &&
              numHours(date.starts) + numHours(date.delay) === dateNum[1] &&
              date.day === dateNum[2])
          ) {
            alive1 = false;
            alive = false;
            setMessage((m) => {
              return [...m, "المواعيد متداخلة رجاءً راجع مواعيدك"];
            });
            break;
          }
        }
        tmpList.push([
          numHours(date.starts),
          numHours(date.starts) + numHours(date.delay),
          date.day,
        ]);
      }
    }

    if (alive) {
      setMessage(() => {
        return ["البينات صحيحة لكن لن يحدث شيء"];
      });
      handleSubmit();
    }
  };

  return (
    <ArabicFormLayout>
      <div className="md:p-12 p-4">
        <div className="flex p-8 rounded-2xl bg-white shadow-2xl flex-col gap-8">
          <h1 className="text-4xl mb-4">تسجيل حساب</h1>
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
          />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="البريد الإلكتروني (gmail)"
            className={classes.inp}
            maxLength={30}
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className={classes.inp}
            placeholder="كلمة المرور"
            required
          />
          <input
            type="password"
            value={password2}
            onChange={(e) => {
              setPassword2(e.target.value);
            }}
            className={classes.inp}
            placeholder="تأكيد كلمة المرور"
            required
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
            مواعيد درس تحفيظ القرآن (مطلوب واحد على الأقل)
          </h2>
          <div className={classes.lesson}>
            {quraan_days.map((date, i) => {
              return (
                <p key={quraan_days.indexOf(date)}>
                  يوم {arDay(date.day)} الساعة {date.starts.slice(0, -3)} لمدة{" "}
                  {date.delay.slice(0, -3)}
                  <button
                    onClick={() => {
                      setQuraan_days(
                        quraan_days.slice(0, i).concat(quraan_days.slice(i + 1))
                      );
                    }}
                    className="bg-red-500 py-1 px-2 rounded-md mr-2"
                  >
                    X
                  </button>
                </p>
              );
            })}
          </div>
          {!(quraan_days.length > 6) ? (
            <button
              className="p-3 rounded-xl text-white bg-green-500"
              onClick={() => {
                setCreateDate({ method: setQuraan_days, value: quraan_days });
              }}
            >
              إضافة
            </button>
          ) : (
            <></>
          )}

          <h2 className="text-xl">مواعيد درس التلاوة (مطلوب واحد على الأقل)</h2>
          <div className={classes.lesson}>
            {telawa_days.map((date, i) => {
              return (
                <p key={telawa_days.indexOf(date)}>
                  يوم {arDay(date.day)} الساعة {date.starts.slice(0, -3)} لمدة{" "}
                  {date.delay.slice(0, -3)}
                  <button
                    onClick={() => {
                      setTelawa_days(
                        telawa_days.slice(0, i).concat(telawa_days.slice(i + 1))
                      );
                    }}
                    className="bg-red-500 py-1 px-2 rounded-md mr-2"
                  >
                    X
                  </button>
                </p>
              );
            })}
          </div>
          {!(telawa_days.length > 6) ? (
            <button
              className="p-3 rounded-xl text-white bg-green-500"
              onClick={() => {
                setCreateDate({ method: setTelawa_days, value: telawa_days });
              }}
            >
              إضافة
            </button>
          ) : (
            <></>
          )}

          <h2 className="text-xl">مواعيد درس الفقه (مطلوب واحد على الأقل)</h2>
          <div className={classes.lesson}>
            {feqh_days.map((date, i) => {
              return (
                <p key={feqh_days.indexOf(date)}>
                  يوم {arDay(date.day)} الساعة {date.starts.slice(0, -3)} لمدة{" "}
                  {date.delay.slice(0, -3)}
                  <button
                    onClick={() => {
                      setFeqh_days(
                        feqh_days.slice(0, i).concat(feqh_days.slice(i + 1))
                      );
                    }}
                    className="bg-red-500 py-1 px-2 rounded-md mr-2"
                  >
                    X
                  </button>
                </p>
              );
            })}
          </div>
          {!(feqh_days.length > 6) ? (
            <button
              className="p-3 rounded-xl text-white bg-green-500"
              onClick={() => {
                setCreateDate({ method: setFeqh_days, value: feqh_days });
              }}
            >
              إضافة
            </button>
          ) : (
            <></>
          )}

          <h2 className="text-xl">
            مواعيد درس السنة النبوية (مطلوب واحد على الأقل)
          </h2>
          <div className={classes.lesson}>
            {suna_days.map((date, i) => {
              return (
                <p key={suna_days.indexOf(date)}>
                  يوم {arDay(date.day)} الساعة {date.starts.slice(0, -3)} لمدة{" "}
                  {date.delay.slice(0, -3)}
                  <button
                    onClick={() => {
                      setSuna_days(
                        suna_days.slice(0, i).concat(suna_days.slice(i + 1))
                      );
                    }}
                    className="bg-red-500 py-1 px-2 rounded-md mr-2"
                  >
                    X
                  </button>
                </p>
              );
            })}
          </div>
          {!(suna_days.length > 6) ? (
            <button
              className="p-3 rounded-xl text-white bg-green-500"
              onClick={() => {
                setCreateDate({ method: setSuna_days, value: suna_days });
              }}
            >
              إضافة
            </button>
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
          <button
            className="p-3 rounded-xl text-white bg-green-500 w-24 cursor-pointer hover:bg-green-700"
            style={{ alignSelf: "end" }}
            onClick={submit}
          >
            إرسال
          </button>
        </div>
      </div>
      {CreateDate({
        ...createDate,
        closeMethod: () => {
          setCreateDate(undefined);
        },
      })}
    </ArabicFormLayout>
  );
}
