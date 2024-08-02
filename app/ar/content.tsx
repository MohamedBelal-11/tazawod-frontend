/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import globalClasses from "../utils/globalClasses";
import { Date, Weekday } from "../utils/students";
import {
  bDate,
  convertEgyptTimeToLocalTime,
  convertEgyptWeekdayToLocal,
  hrNumber,
  numHours,
  sumStartAndDelay,
  sortDaysFromToday,
} from "../utils/time";
import { arDay } from "../utils/arabic";
import axios from "axios";
import { backendUrl } from "../utils/auth";
import { motion, Variants } from "framer-motion";
import {
  ArrowPathIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

const ADE = ({ copy }: { copy: string }) => {
  return (
    <button
      className={
        "bg-green-200 border-2 border-solid border-green-500 px-4 py-3 " +
        "rounded-xl hover:text-white hover:bg-green-500 transition-all flex gap-2 items-center"
      }
      onClick={(e) => {
        const span = e.currentTarget.querySelector("span");
        navigator.clipboard
          .writeText(copy)
          .then(() => {
            if (span) {
              span.innerText = "تم النسخ";
              setTimeout(() => {
                span.innerText = "نسخ";
              }, 5000);
            }
          })
          .catch((e) => {
            if (span) {
              span.innerText = "فشل" + String(e);
              setTimeout(() => {
                span.innerText = "نسخ";
              }, 5000);
            }
          });
      }}
    >
      <span>نسخ</span>
      <DocumentDuplicateIcon width={20} />
    </button>
  );
};

const MC1 = ({ onClick }: { onClick: () => any }) => {
  const [clicked, setClicked] = useState(false);

  const method1 = () => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 400);
    onClick();
  };

  return (
    <motion.button
      className="border-2 border-solid border-sky-500 px-4 py-3 rounded-xl"
      onClick={method1}
      variants={{
        hov: {
          backgroundColor: "#0ea5e9",
          color: "white",
        },
        ini: {
          backgroundColor: "#bae6fd",
          color: "black",
        },
        tap: {
          backgroundColor: "#0ea5e9",
          color: "white",
        },
      }}
      initial="ini"
      whileHover="hov"
      animate={clicked ? "hov" : "ini"}
      whileFocus="hov"
      whileTap="tap"
    >
      <motion.div
        variants={{
          ini: { rotate: 0 },
          hov: { rotate: 90 },
          tap: { rotate: 135 },
        }}
      >
        <ArrowPathIcon width={20} />
      </motion.div>
    </motion.button>
  );
};

const MC2 = ({
  url,
  student,
  onSubmit = () => {},
}: {
  url: string | null;
  student: string;
  onSubmit?: () => any;
}) => {
  const [val, setVal] = useState(url ? url : "");
  const [massage, setMessage] = useState<
    { succes: boolean; text: string } | undefined
  >();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    // Retrieve the token from the local storage.
    const token = localStorage.getItem("token");
    try {
      // Make an HTTP GET request to the server.
      // The request includes an Authorization header with the token.
      const respons = await axios.get(backendUrl + "/api/home/", {
        headers: {
          // Set the Authorization header to include the token.
          Authorization: `Token ${token}`,
        },
      });
      // If the request is successful, update the response state with the data received from the server.
      setMessage({ succes: true, text: "تمت إضافة الرابط بنجاح" });
      onSubmit();
      setLoading(false);
    } catch (error: any) {
      // If there is an error, log the error to the console.
      setMessage({
        succes: false,
        text:
          "حدث خطأ أثناء إضافة الرابط رجاءالتأكد من الرابط أو إعادة نسخه  " +
          String(error.message),
      });
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-lg flex flex-col gap-4 items-center p-8 text-center">
      <p className="text-xl">لديك حصة مع الطالب {student}</p>
      <input
        type="text"
        placeholder="رابط المقابلة"
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
        }}
        dir="ltr"
        className={
          "outline-0 border-gray-500 p-3 max-w-96 w-full border-solid border-2 rounded-lg" +
          (val === url ? " bg-gray-300" : "")
        }
      />
      <div className="flex flex-row gap-4 justify-center">
        {val === url ? (
          <a
            href={url}
            target="_blank"
            className={
              "bg-sky-200 border-2 border-solid border-sky-500 px-4 py-3 " +
              "rounded-xl hover:text-white hover:bg-sky-500 transition-all"
            }
          >
            دخول
          </a>
        ) : (
          <button
            className={
              "bg-green-200 border-2 border-solid border-green-500 px-4 py-3 " +
              "rounded-xl hover:text-white hover:bg-green-500 transition-all"
            }
            onClick={loading ? undefined : fetchData}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                className="w-6 h-6 border-gray-300 border-solid border-4 border-t-sky-500 rounded-full"
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
            ) : url === null ? (
              "إنشاء"
            ) : (
              "تعديل"
            )}
          </button>
        )}
        {val === url ? (
          <ADE copy={url} />
        ) : url !== null ? (
          <button
            className={
              "bg-red-200 border-2 border-solid border-red-500 px-4 py-3 " +
              "rounded-xl hover:text-white hover:bg-red-500 transition-all"
            }
            onClick={() => {
              setVal(url);
            }}
          >
            إلغاء
          </button>
        ) : null}
      </div>
      {massage ? (
        <p
          className={
            "border-2 border-solid px-6 py-4 rounded-xl text-center " +
            (massage.succes
              ? "bg-green-100 border-green-500"
              : "bg-red-100 border-red-500")
          }
        >
          {massage.text}
        </p>
      ) : null}
    </section>
  );
};

export const secondsToHrs = (seconds: number) => {
  return seconds / 60 / 60;
};

type adminMeeting = {
  teacher: string;
  starts: string;
  student: string;
  delay: number;
  url: string;
};

type meeting = {
  student: string;
  starts: string;
  delay: number;
};

type responset =
  | {
      userType: "student";
      subscribed: true;
      quraan_days: Date[];
      currentMeet: { url: string | null; teacher: string } | null;
      notes: {
        teacher: string;
        rate: number;
        discription: string;
        date: string;
      }[];
    }
  | {
      userType: "student";
      subscribed: false;
      quraan_days: Date[];
      notes: {
        teacher: string;
        rate: number;
        discription: string;
        date: string;
      }[];
    }
  | {
      userType: "teacher" | "admin";
      is_accepted: false;
      super_admins: { name: string; phone: string }[];
    }
  | {
      userType: "teacher";
      is_accepted: true;
      today_meetings: meeting[];
      tomorrow_meetings: meeting[];
      currentMeet: { url: string | null; student: string } | null;
      notes: {
        student: string;
        rate: number;
        discription: string;
        date: string;
      }[];
    }
  | {
      userType: "admin";
      is_accepted: true;
      live_meetings: adminMeeting[];
    }
  | {
      name: string;
      userType: "superadmin";
      live_meetings: adminMeeting[];
    }
  | null;

const feutures: { header: string; description: string }[] = [
  {
    header: "منهجية شاملة ومحكمة",
    description:
      "تقدم أكادمية تزود منهجًا متكاملًا لتحفيظ القرآن الكريم، " +
      "يشمل قواعد التجويد والترتيل، مع تدرج منطقي في الحفظ والتلاوة.\n" +
      "يتضمن المنهج تقسيمات واضحة للآيات والسور، " +
      "مما يسهل على المتعلمين تحقيق تقدم مستمر ومنظم.",
  },
  {
    header: "تقنيات حديثة",
    description:
      "تستخدم المنصة أحدث التقنيات في التعليم الإلكتروني، " +
      "بما في ذلك الصوتيات والفيديوهات عالية الجودة، لدعم تجربة التعلم.\n" +
      "توفر أكادمية تزود أدوات تفاعلية مثل " +
      "البطاقات التعليمية والاختبارات القصيرة لتعزيز الفهم والاستذكار.",
  },
  {
    header: "دروس فردية",
    description: "يمكن لطلبة العلم اختيار بين جلسات تعليمية فردية مع معلم مختص",
  },
  {
    header: "متابعة وتقييم مستمر",
    description:
      "تتبع أكادمية تزود تقدم الطلاب من خلال نظام " +
      "دقيق للتقييم، يشمل اختبارات دورية وتقييمات شخصية.\n" +
      "يحصل الطالب على مراجعة مستمرة من المعلمين لتحسين الأداء وضمان التقدم.",
  },
  {
    header: "تخصيص مواعد",
    description:
      "يمكن للطلاب نخصيص مواعيد في الوقت الذي يريدونه بشكل متنوع دون أي قود",
  },
];

const classes = {
  header:
    "w-full flex justify-center items-center flex-nowrap gap-4 sm:gap-8 bg-white py-20",
  cardsContainer: "flex flex-nowrap gap-4 py-12 w-full overflow-x-auto",
};

const cCV: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const CCV: Variants = {
  hidden: {
    x: -1500,
  },
  visible: {
    x: 0,
    transition: {
      duration: 1,
      ease: "anticipate",
    },
  },
};

export default function Content() {
  const [response, setResponse] = useState<responset>();

  const fetchData1 = async () => {
    // Retrieve the token from the local storage.
    const token = localStorage.getItem("token");

    try {
      // Make an HTTP GET request to the server.
      // The request includes an Authorization header with the token.
      const respons = await axios.get(backendUrl + "/api/home/", {
        headers: {
          // Set the Authorization header to include the token.
          Authorization: `Token ${token}`,
        },
      });

      // If the request is successful, update the response state with the data received from the server.
      console.log(respons.data);
      setResponse(respons.data);
    } catch (error) {
      // If there is an error, log the error to the console.
      console.error(error);
    }
  };

  useEffect(() => {
    // Define an asynchronous function named fetchData.
    // This function will make an HTTP GET request to the server to retrieve data.
    // The request includes an Authorization header with a token.
    // The token is retrieved from the local storage.
    // const fetchData = async () => {
    //   // Retrieve the token from the local storage.
    //   const token = localStorage.getItem("token");

    //   try {
    //     // Make an HTTP GET request to the server.
    //     // The request includes an Authorization header with the token.
    //     const respons = await axios.get(backendUrl + "/api/home/", {
    //       headers: {
    //         // Set the Authorization header to include the token.
    //         Authorization: `Token ${token}`,
    //       },
    //     });

    //     // If the request is successful, update the response state with the data received from the server.
    //     console.log(respons.data);
    //     setResponse(respons.data);
    //   } catch (error) {
    //     // If there is an error, log the error to the console.
    //     console.error(error);
    //   }
    // };
    if (!response) {
      // fetchData();
      setResponse({
        userType: "student",
        subscribed: true,
        currentMeet: { teacher: "فهد محمد", url: null },
        notes: [],
        quraan_days: [
          { starts: "07:00:00", delay: 1800, day: "sunday" },
          { starts: "07:00:00", delay: 1800, day: "tuesday" },
          { starts: "07:00:00", delay: 1800, day: "thurusday" },
        ],
      });
    }
  }, [response]);
  return (
    <>
      <header className={classes.header}>
        <img src="/static/imgs/logo-green.png" className="max-w-lg w-3/5" />
        <img src="/static/imgs/quraan.png" className="max-w-48 w-1/6" />
      </header>
      {response ? (
        <main className={globalClasses.main}>
          {response.userType === "student" ? (
            response.subscribed && response.currentMeet ? (
              response.currentMeet.url ? (
                <section className="bg-white rounded-lg flex flex-col gap-4 p-8 text-center">
                  <p className="text-xl">
                    المعلم: {response.currentMeet.teacher} ينتظرك في الغرفة
                  </p>
                  <div className="flex flex-row gap-4 justify-center">
                    <a
                      href={response.currentMeet.url}
                      target="_blank"
                      className={
                        "bg-sky-200 border-2 border-solid border-sky-500 px-4 py-3 " +
                        "rounded-xl hover:text-white hover:bg-sky-500 transition-all"
                      }
                    >
                      دخول
                    </a>
                    <ADE copy={response.currentMeet.url} />
                  </div>
                </section>
              ) : (
                <section className="bg-white rounded-lg flex flex-col items-center gap-4 p-8 text-center">
                  <p className="text-xl">
                    لم يقم المعلم بإنشاء غرفة بعد برجاء الإنتظار
                  </p>
                  <MC1 onClick={fetchData1} />
                </section>
              )
            ) : null
          ) : response.userType === "teacher" ? (
            response.is_accepted && response.currentMeet ? (
              <MC2
                url={response.currentMeet.url}
                student={response.currentMeet.student}
              />
            ) : null
          ) : null}

          {response.userType === "student" ? (
            <section>
              <h2>
                <span className={globalClasses.sectionHeader}>دروسك</span>
              </h2>
              <motion.div
                className={classes.cardsContainer}
                variants={cCV}
                initial="hidden"
                animate="visible"
              >
                {response.quraan_days
                  .map((mt) => {
                    const [day, time] = convertEgyptWeekdayToLocal(
                      mt.day,
                      mt.starts
                    ) as [Weekday, string];
                    return { ...mt, day, starts: time };
                  })
                  .sort(
                    (a, b) =>
                      sortDaysFromToday(a.day) - sortDaysFromToday(b.day)
                  )
                  .map((date, i) => {
                    return (
                      <motion.div
                        key={i}
                        className={
                          "px-8 rounded-lg bg-white *:my-4 *:text-nowrap py-4 block " +
                          "transition-all duration-300 w-max *:w-max"
                        }
                        variants={CCV}
                      >
                        <p className="text-3xl font-bold">{arDay(date.day)}</p>
                        <p className="text-2xl">
                          يبدأ الساعة {date.starts.slice(0, -3)}
                        </p>

                        <p>
                          ينتهي الساعة{" "}
                          {convertEgyptTimeToLocalTime(
                            hrNumber(
                              numHours(date.starts) + secondsToHrs(date.delay)
                            )
                          )}
                        </p>
                      </motion.div>
                    );
                  })}
              </motion.div>
            </section>
          ) : response.userType === "teacher" ? (
            response.is_accepted ? (
              <section>
                <h2 className={globalClasses.sectionHeader}>دروس اليوم</h2>
                <motion.div
                  className={classes.cardsContainer}
                  variants={cCV}
                  initial="hidden"
                  animate="visible"
                >
                  {response.today_meetings.map((meeting, i) => {
                    return (
                      <motion.div
                        key={i}
                        className={
                          "px-8 rounded-lg bg-white *:my-4 *:text-nowrap py-4 block " +
                          "transition-all duration-300 w-max *:w-max"
                        }
                        variants={CCV}
                      >
                        <p className="text-3xl font-bold">
                          الطالب: {meeting.student}
                        </p>
                        <p className="text-2xl">
                          يبدأ الساعة{" "}
                          {convertEgyptTimeToLocalTime(
                            meeting.starts.slice(0, -3)
                          )}
                        </p>
                        <p>
                          ينتهي الساعة{" "}
                          {convertEgyptTimeToLocalTime(
                            hrNumber(
                              numHours(meeting.starts) +
                                secondsToHrs(+meeting.delay)
                            )
                          )}
                        </p>
                      </motion.div>
                    );
                  })}
                </motion.div>
                <h2 className={globalClasses.sectionHeader}>دروس الغد</h2>
                <motion.div
                  className={classes.cardsContainer}
                  variants={cCV}
                  initial="hidden"
                  animate="visible"
                >
                  {response.tomorrow_meetings.map((meeting, i) => {
                    return (
                      <motion.div
                        key={i}
                        className={
                          "px-8 rounded-lg bg-white *:my-4 *:text-nowrap py-4 block " +
                          "transition-all duration-300 w-max *:w-max"
                        }
                        variants={CCV}
                      >
                        <p className="text-3xl font-bold">
                          الطالب: {meeting.student}
                        </p>
                        <p className="text-2xl">
                          يبدأ الساعة{" "}
                          {convertEgyptTimeToLocalTime(
                            meeting.starts.slice(0, -3)
                          )}
                        </p>
                        <p>
                          ينتهي الساعة{" "}
                          {convertEgyptTimeToLocalTime(
                            hrNumber(
                              numHours(meeting.starts) +
                                secondsToHrs(+meeting.delay)
                            )
                          )}
                        </p>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </section>
            ) : (
              <section className="md:m-8 rounded-xl bg-white p-6">
                <h2 className="text-xl font-bold text-center">
                  لم يتم الموفقة عليك بعد أرجو أن تقوم بقراة دليل المعلم حتى يتم
                  الموافقة عليك
                </h2>
                <div className="mt-4 flex justify-center">
                  <Link
                    href="#"
                    className={
                      "px-6 py-4 bg-sky-100 rounded-2xl border-2 border-sky-400 border-solid " +
                      "hover:bg-sky-400 hover:text-white transition-all"
                    }
                  >
                    دليل المعلم
                  </Link>
                </div>
              </section>
            )
          ) : (response.userType === "admin" && response.is_accepted) ||
            response.userType === "superadmin" ? (
            <section>
              <h2 className={globalClasses.sectionHeader}>دروس اليوم</h2>
              <motion.div
                className={classes.cardsContainer}
                variants={cCV}
                initial="hidden"
                animate="visible"
              >
                {response.live_meetings.map((meeting, i) => (
                  <motion.div
                    key={i}
                    className={
                      "px-8 rounded-lg bg-white *:my-4 *:text-nowrap py-4 block " +
                      "transition-all duration-300 w-max *:w-max"
                    }
                    variants={CCV}
                  >
                    <p className="text-3xl font-bold">
                      الطالب: {meeting.student}
                    </p>
                    <p className="text-3xl font-bold">
                      المعلم: {meeting.teacher}
                    </p>
                    <p className="text-2xl">
                      يبدأ الساعة{" "}
                      {convertEgyptTimeToLocalTime(meeting.starts.slice(0, -3))}
                    </p>
                    <p>
                      ينتهي الساعة{" "}
                      {convertEgyptTimeToLocalTime(
                        sumStartAndDelay(meeting.starts, meeting.delay)
                      )}
                    </p>
                    <a
                      href={meeting.url}
                      target="_blank"
                      className={
                        "px-6 py-4 bg-orange-100 rounded-2xl border-2 border-orange-400 " +
                        "border-solid hover:bg-orange-400 hover:text-white transition-all"
                      }
                    >
                      دخول المقابلة
                    </a>
                  </motion.div>
                ))}
              </motion.div>
            </section>
          ) : (
            <section className="md:m-8 rounded-xl bg-white p-6">
              <h2 className="text-xl font-bold text-center">
                لم يتم الموفقة عليك بعد أرجو أن تقوم بقراة دليل المشرف حتى يتم
                الموافقة عليك
              </h2>
              <div className="mt-4 flex justify-center">
                <Link
                  href="#"
                  className={
                    "px-6 py-4 bg-sky-100 rounded-2xl border-2 border-sky-500 border-solid " +
                    "hover:bg-sky-500 hover:text-white transition-all"
                  }
                >
                  دليل المشرف
                </Link>
              </div>
            </section>
          )}

          {response.userType === "student" && !response.subscribed ? (
            <section className="p-8 rounded-3xl bg-white">
              <h2 className="text-3xl font-bold text-center">
                أنت لم تشترك حتى الآن
              </h2>
              <div className="mt-4 flex justify-evenly">
                <Link
                  href="#"
                  className={
                    "p-8 bg-yellow-100 rounded-2xl border-2 border-yellow-400 " +
                    "border-solid hover:bg-yellow-400 transition-all"
                  }
                >
                  إشتراك
                </Link>
              </div>
            </section>
          ) : (response.userType === "teacher" ||
              response.userType === "admin") &&
            !response.is_accepted &&
            response.super_admins.length !== 0 ? (
            <section>
              <h2 className={globalClasses.sectionHeader}>
                بعض الشرفين الكبار الذين يمكنك التواصل معهم
              </h2>
              <motion.div
                className={classes.cardsContainer}
                variants={cCV}
                initial="hidden"
                animate="visible"
              >
                <div></div>
                {response.super_admins.map((admin, i) => {
                  return (
                    <motion.div
                      key={i}
                      className={
                        "px-8 rounded-lg bg-white *:my-4 *:text-nowrap py-4 block " +
                        "transition-all duration-300 w-max *:w-max"
                      }
                      variants={CCV}
                    >
                      <p className="text-2xl font-bold">المشرف: {admin.name}</p>
                      <p className="text-xl font-bold">
                        رقم المشرف: <span dir="ltr">+{admin.phone}</span>
                      </p>
                    </motion.div>
                  );
                })}
                <div></div>
              </motion.div>
            </section>
          ) : null}

          {response.userType === "student" && response.notes.length !== 0 ? (
            <section>
              <h2>
                <span className={globalClasses.sectionHeader}>
                  آخر التقارير
                </span>
              </h2>
              <div>
                {response.notes.map((note, i) => {
                  return (
                    <div key={i} className="p-8 bg-white rounded-3xl my-6">
                      <h3 className="flex justify-between text-2xl font-semibold">
                        <span>
                          {bDate.getFormedDate(note.date, { form: "arabic" })}
                        </span>
                        <span>
                          {note.rate}/<span className="text-sm">10</span>
                        </span>
                      </h3>
                      <div className="my-6 text-xl font-reguler">
                        {note.discription.split("\n").map((line, i) => {
                          return (
                            <p className="my-2" key={i}>
                              {line}
                            </p>
                          );
                        })}
                      </div>
                      <p className="flex justify-end text-3xl font-reguler">
                        المعلم: {note.teacher}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : response.userType === "teacher" &&
            response.is_accepted &&
            response.notes.length !== 0 ? (
            <section>
              <h2>
                <span className={globalClasses.sectionHeader}>
                  آخر التقارير
                </span>
              </h2>
              <div>
                {response.notes.map((note, i) => {
                  return (
                    <div key={i} className="p-8 bg-white rounded-3xl my-6">
                      <h3 className="flex justify-between text-2xl font-semibold">
                        <span>
                          {bDate.getFormedDate(note.date, { form: "arabic" })}
                        </span>
                        <span>
                          {note.rate}/<span className="text-sm">10</span>
                        </span>
                      </h3>
                      <div className="my-6 text-xl font-reguler">
                        {note.discription.split("\n").map((line, i) => {
                          return (
                            <p className="my-2" key={i}>
                              {line}
                            </p>
                          );
                        })}
                      </div>
                      <p className="flex justify-end text-3xl font-reguler">
                        الطالب: {note.student}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}
        </main>
      ) : (
        <main className={globalClasses.main}>
          <section className="flex justify-center">
            <div className="bg-white p-8 rounded-3xl">
              <p className="text-2xl text-center">بادر بلإنضمام إلينا</p>
              <div className="flex justify-center gap-4 mt-8">
                <Link
                  className="p-2 rounded-xl block bg-gray-300"
                  href="/ar/auth/login"
                >
                  تسجيل دخول
                </Link>
                <Link
                  className="p-2 rounded-xl block bg-green-600 border-green-600 text-white"
                  href="/ar/auth/register/student"
                >
                  تسجيل حساب
                </Link>
              </div>
            </div>
          </section>
          <article>
            {feutures.map((feuture, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-lg my-4 p-4"
                initial={{ x: "45%", scale: 0.7 }}
                whileInView={{ x: 0, scale: 1 }}
                viewport={{ amount: 0.5 }}
                transition={{ type: "spring", mass: "0.5" }}
              >
                <p className="text-3xl text-center">{feuture.header}</p>
                <div className="flex-col flex justify-center min-h-80 px-6">
                  {feuture.description.split("\n").map((line, i) => (
                    <p key={i} className="text-2xl my-6 text-center">
                      {line}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </article>
        </main>
      )}
    </>
  );
}
