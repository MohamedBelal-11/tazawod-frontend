/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { arDay } from "@/app/utils/arabic";
import {
  almightyTrim,
  arCharsList,
  charsList,
  numList,
} from "@/app/utils/string";
// import { numHours } from "@/app/utils/time";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { backendUrl } from "@/app/utils/auth";
import PasswordInput from "@/app/components/passwordInput";
import { convertLocalTimeToEgyptTime, days } from "@/app/utils/time";
import MyPhoneInput from "@/app/components/phoneInput";
import { AnimatePresence, motion } from "framer-motion";
import { Weekday } from "@/app/utils/students";
import { get } from "@/app/utils/docQuery";
import "./page.css"
import { useArabicLayoutContext } from "@/app/contexts/arabicLayoutContext";

export type MetaInfo = { day: Weekday; starts: string; delay: string };

const classes = {
  inp:
    "p-3 text-xl border-2 border-gray-300 focus:border-sky-500 " +
    "rounded-xl border-solid max-w-96 w-full outline-0 shadow-3xl",
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

function CreateDate(props: {
  method?: Dispatch<SetStateAction<MetaInfo[]>>;
  value?: MetaInfo[];
  closeMethod: () => void;
}) {
  const [start, setStart] = useState("15:00:00");
  const [delay, setDelay] = useState("2:00:00");
  const [addDays, setAddDays] = useState<Weekday[]>([]);
  const [red, setRed] = useState(false);

  if (props.method === undefined || props.value === undefined) {
    return;
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
    setAddDays([]);
  };

  const add = () => {
    if (!red && addDays.length !== 0) {
      for (let day of addDays) {
        props.method!((v) => {
          return [...v, { day: day, starts: start, delay: delay }];
        });
        reset();
        props.closeMethod();
      }
    }
  };

  const cancel = () => {
    reset();
    props.closeMethod();
  };

  return (
    <motion.div
      className="w-full h-screen fixed flex justify-center items-center top-0"
      style={{ zIndex: 2 }}
      initial={{ backgroundColor: "transparent" }}
      animate={{ backgroundColor: "#1113", transition: { duration: 0.5 } }}
      exit={{
        backgroundColor: "transparent",
        transition: { delay: 0.5, duration: 0.5 },
      }}
    >
      <motion.div
        className="p-6 rounded-2xl bg-white flex flex-col gap-4 max-h-screen overflow-y-scroll"
        initial={{ height: 0 }}
        animate={{
          height: "auto",
          transition: { duration: 0.5 },
        }}
        exit={{ height: 0, transition: { duration: 0.5 } }}
      >
        <h1 className="text-3xl">إضافة موعد</h1>
        <div className="flex gap-4 flex-wrap justify-center *:flex-grow">
          <div className={classes.createDateCard}>
            <p className="text-2xl">اليوم</p>
            {days.map((day) => {
              if (list.includes(day)) {
                return undefined;
              }

              return (
                <p key={day}>
                  <label htmlFor={day} className="cursor-pointer">
                    {arDay(day)}
                  </label>
                  <input
                    className="mr-1 cursor-pointer"
                    type="checkbox"
                    id={day}
                    checked={addDays.includes(day)}
                    onChange={(e) => {
                      if (!e.target.checked) {
                        let index = addDays.indexOf(day);
                        setAddDays([
                          ...addDays.slice(0, index),
                          ...addDays.slice(index + 1),
                        ]);
                      } else {
                        setAddDays([...addDays, day]);
                      }
                    }}
                  />
                </p>
              );
            })}
            {addDays.length === 0 ? (
              <p>رجاءً قم بإختيار يوم واحد على الأقل</p>
            ) : undefined}
          </div>
          <div className={classes.createDateCard}>
            <p className="text-2xl">يبدأ الساعة</p>
            <input
              type="time"
              className={classes.craateDateInp}
              value={start}
              onChange={(e) => {
                setRed(
                  !(
                    e.target.value.slice(-2) === "00" ||
                    e.target.value.slice(-2) === "30"
                  )
                );
                setStart(e.target.value + ":00");
              }}
            />
            <p className={red ? "text-red-500" : undefined}>
              يجب أن يكون عدد الدقائق 30 أو 0
            </p>
          </div>
          <div className={classes.createDateCard}>
            <p className="text-2xl">المدة</p>
            <div className="flex gap-2">
              <div className="flex flex-col items-center">
                <p>الدقائق</p>
                <div
                  onClick={() => {
                    let mins = delay.slice(-5, -3);
                    if (
                      (mins === "30" || delay.slice(0, -6) === "3") &&
                      delay.slice(0, -6) !== "0"
                    ) {
                      setDelay(delay.slice(0, -6) + ":00:00");
                    } else {
                      setDelay(delay.slice(0, -6) + ":30:00");
                    }
                  }}
                  className={classes.craateDateInp}
                >
                  {delay.slice(-5, -3)}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <p>الساعات</p>
                <div className={classes.inp + " flex items-center"}>
                  <p>{delay.slice(0, -6)}</p>
                  <div className="flex flex-col">
                    <div
                      className={
                        classes.craateDateInp + " text-sm cursor-pointer"
                      }
                      onClick={() => {
                        if (!(Number(delay.slice(0, -6)) > 2)) {
                          setDelay(
                            delay.slice(0, -6) === "2"
                              ? "3:00:00"
                              : String(Number(delay.slice(0, -6)) + 1) +
                                  delay.slice(-6)
                          );
                        }
                      }}
                      style={{
                        userSelect: "none",
                        msUserSelect: "none",
                        MozUserSelect: "none",
                      }}
                    >
                      ▲
                    </div>
                    <div
                      className={
                        classes.craateDateInp + " text-sm cursor-pointer"
                      }
                      onClick={() => {
                        if (!(Number(delay.slice(0, -6)) < 1)) {
                          setDelay(
                            delay.slice(0, -6) === "1"
                              ? "0:30:00"
                              : String(Number(delay.slice(0, -6)) - 1) +
                                  delay.slice(-6)
                          );
                        }
                      }}
                      style={{
                        userSelect: "none",
                        msUserSelect: "none",
                        MozUserSelect: "none",
                      }}
                    >
                      ▼
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <div
            className="p-3 rounded-xl text-white bg-red-500 cursor-pointer"
            onClick={cancel}
          >
            إلغاء
          </div>
          <div
            className="p-3 rounded-xl text-white bg-green-500 cursor-pointer"
            onClick={add}
          >
            إضافة
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Content() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+20");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [gender, setGender] = useState<"male" | "female">();
  const [quraan_days, setQuraan_days] = useState<MetaInfo[]>([]);
  const [createDate, setCreateDate] = useState<{
    method: Dispatch<SetStateAction<MetaInfo[]>>;
    value: MetaInfo[];
  }>();
  const [message, setMessage] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const {setLayoutProperties} = useArabicLayoutContext()!

  useEffect(() => {
    setLayoutProperties({className: "pt-4"})
  }, [setLayoutProperties])

  useEffect(() => {
    if (createDate) {
      get<HTMLBodyElement>("html")[0].classList.add("overflow-y-hidden");
    } else {
      get<HTMLBodyElement>("html")[0].classList.remove("overflow-y-hidden");
    }
  }, [createDate])

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = {
        name: almightyTrim(name),
        phone_number: phoneNumber.trim(),
        gender: gender,
        password: password,
        quraan_days: quraan_days.map((date) => {
          return {
            ...date,
            starts:
              convertLocalTimeToEgyptTime(date.starts.slice(0, -3)) + ":00",
          };
        }),
      };
      const response = await axios.post(
        backendUrl + "/users/student/register/",
        data
      );
      if (response.status === 201) {
        setMessage(["تم تسجيل الطالب"]);

        const token = response.data.token; // this to...
        // Store the token in local storage or any other secure place
        localStorage.setItem("token", token);
        setMessage((m) => {
          return [...m, "تم تسجيل الدخول"];
        }); //                               here will be deleted later
        setLoading(false);
        router.push("/");
        // Store the password temporarily (e.g., in state or context) until OTP verification
        // sessionStorage.setItem("temp_verfiy", JSON.stringify({password: password, phone: phoneNumber}));
        // // Redirect to OTP verification page
        // router.push("/auth/verify-otp");
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
    const marksList = ["!", "@", "#", "$", "%", "^", "&", "*", "?", "_", "-"];
    let alive = true;
    // let tmpList: any[][] = [];
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

    if (phoneNumber.length < 9) {
      alive = false;
      setMessage((m) => {
        return [...m, "رجاءً قم بإدخال رقم الهاتف"];
      });
    }

    for (let c of password) {
      if (![...charsList, ...numList, ...marksList].includes(c)) {
        alive = false;
        setMessage((m) => {
          return [
            ...m,
            "يجب أن تحتوي كلمة المرور على حروف" +
              " إنجليزية وبعض هذه الرموز !@#$%^?&*_- و أرقام فقط (لا مسافات)",
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
        return [...m, "يجب أن تحتوي كلمة المرور على بعض هذه الرموز !@#$%^&*_-"];
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
    // alive1 = true;
    for (let list of [quraan_days]) {
      if (list.length === 0) {
        setMessage((m) => {
          return [
            ...m,
            "هناك خانة مواعيد فارغة رجاءً ضع  فيها موعد واحد على الأقل",
          ];
        });
        alive = false;
      }
    }
    //     break;
    //   }
    //   for (let date of list) {
    //     if (!alive1) {
    //       break;
    //     }
    //     for (let dateNum of tmpList) {
    //       if (
    //         (numHours(date.starts) > dateNum[0] &&
    //           numHours(date.starts) < dateNum[1] &&
    //           date.day === dateNum[2]) ||
    //         (numHours(date.starts) + numHours(date.delay) > dateNum[0] &&
    //           numHours(date.starts) + numHours(date.delay) < dateNum[1] &&
    //           date.day === dateNum[2]) ||
    //         (dateNum[0] > numHours(date.starts) &&
    //           dateNum[0] < numHours(date.starts) + numHours(date.delay) &&
    //           date.day === dateNum[2]) ||
    //         (dateNum[1] > numHours(date.starts) &&
    //           dateNum[1] < numHours(date.starts) + numHours(date.delay) &&
    //           date.day === dateNum[2]) ||
    //         (numHours(date.starts) === dateNum[0] &&
    //           numHours(date.starts) + numHours(date.delay) === dateNum[1] &&
    //           date.day === dateNum[2])
    //       ) {
    //         alive1 = false;
    //         alive = false;
    //         setMessage((m) => {
    //           return [...m, "المواعيد متداخلة رجاءً راجع مواعيدك"];
    //         });
    //         break;
    //       }
    //     }
    //     tmpList.push([
    //       numHours(date.starts),
    //       numHours(date.starts) + numHours(date.delay),
    //       date.day,
    //     ]);
    //   }
    // }

    if (alive) {
      handleSubmit();
    }
  };

  return (
    <>
      <div className="md:p-12 p-4">
        <form
          onSubmit={submit}
          className="flex p-8 rounded-2xl bg-white shadow-2xl flex-col gap-8"
        >
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
            autoComplete="name"
          />
          <MyPhoneInput value={phoneNumber} onChange={setPhoneNumber} />
          {phoneNumber.startsWith("970") && (
            <motion.p
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}
              initial="hidden"
              animate="visible"
            >
              {"دائمًا في القلب ❤".split("").map((c, i) => (
                <motion.span
                  key={i}
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                >
                  {c}
                </motion.span>
              ))}
            </motion.p>
          )}
          <PasswordInput
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className={
              "p-3 text-xl border-2 border-gray-300 focus:border-sky-500 w-full " +
              "rounded-xl border-solid outline-0 shadow-3xl"
            }
            placeholder="كلمة المرور"
            divclassname="max-w-96 w-full"
            required
            autoComplete="new-password"
          />
          <PasswordInput
            value={password2}
            onChange={(e) => {
              setPassword2(e.target.value);
            }}
            className={
              "p-3 text-xl border-2 border-gray-300 focus:border-sky-500 " +
              "w-full rounded-xl border-solid outline-0 shadow-3xl"
            }
            placeholder="تأكيد كلمة المرور"
            divclassname="max-w-96 w-full"
            required
            autoComplete="new-password"
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
}
