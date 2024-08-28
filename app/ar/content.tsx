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

const MC2 = ({
  url,
  student,
}: {
  url: string;
  student: string;
}) => {
  return (
    <section className="bg-white rounded-lg flex flex-col gap-4 items-center p-8 text-center">
      <p className="text-xl">لديك حصة مع الطالب {student}</p>
      <p className="text-xl">رابط المقابلة</p>
      <p
        dir="ltr"
        className={
          "outline-0 border-gray-500 p-3 max-w-96 w-full " +
          "border-solid border-2 rounded-lg bg-gray-300"
        }
      >{url}</p>
      <div className="flex flex-row gap-4 justify-center">
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
        <ADE copy={url} />
      </div>
    </section>
  );
};

export const secondsToHrs = (seconds: number) => {
  return seconds / 60 / 60;
};

type adminMeeting = {
  teacher: string | null;
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
      currentMeet: { url: string; teacher: string | null } | null;
      notes: {
        teacher: string;
        rate: number;
        description: string;
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
        description: string;
        date: string;
      }[];
    }
  | {
      userType: "teacher" | "admin";
      is_accepted: false;
      super_admins: { name: string; gmail: string }[];
    }
  | {
      userType: "teacher";
      is_accepted: true;
      today_meetings: meeting[];
      tomorrow_meetings: meeting[];
      currentMeet: { url: string; student: string } | null;
      notes: {
        student: string;
        rate: number;
        description: string;
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
      "تقدم أكاديمية تزود منهجًا متكاملًا لتحفيظ القرءان الكريم، " +
      "يشمل قواعد التجويد والترتيل، مع تدرج منطقي في الحفظ والتلاوة.\n" +
      "يتضمن المنهج تقسيمات واضحة للآيات والسور، " +
      "مما يسهل على المتعلمين تحقيق تقدم مستمر ومنظم.",
  },
  {
    header: "تقنيات حديثة",
    description:
      "تستخدم المنصة أحدث التقنيات في التعليم الإلكتروني، " +
      "بما في ذلك الصوتيات والفيديوهات عالية الجودة، لدعم تجربة التعلم.\n" +
      "توفر أكاديمية تزود أدوات تفاعلية مثل " +
      "البطاقات التعليمية والاختبارات القصيرة لتعزيز الفهم والاستذكار.",
  },
  {
    header: "دروس فردية",
    description: "يمكن لطلبة العلم اختيار بين جلسات تعليمية فردية مع معلم مختص",
  },
  {
    header: "متابعة وتقييم مستمر",
    description:
      "تتبع أكاديمية تزود تقدم الطلاب من خلال نظام " +
      "دقيق للتقييم، يشمل اختبارات دورية وتقييمات شخصية.\n" +
      "يحصل الطالب على مراجعة مستمرة من المعلمين لتحسين الأداء وضمان التقدم.",
  },
  {
    header: "تخصيص مواعيد",
    description:
      "يمكن للطلاب تخصيص مواعيد في الوقت الذي يريدونه بشكل متنوع دون أي قيود",
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

  useEffect(() => {
    // Define an asynchronous function named fetchData.
    // This function will make an HTTP GET request to the server to retrieve data.
    // The request includes an Authorization header with a token.
    // The token is retrieved from the local storage.
    const fetchData = async () => {
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
    if (!response) {
      fetchData();
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
              <section className="bg-white rounded-lg flex flex-col gap-4 p-8 text-center">
                <p className="text-xl">
                  {response.currentMeet.teacher
                    ? `المعلم: ${response.currentMeet.teacher} ينتظرك في الغرفة`
                    : "ها هي المقابلة سيدخل معلم قريبًا"}
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
            ) : undefined
          ) : response.userType === "teacher" ? (
            response.is_accepted && response.currentMeet ? (
              <MC2
                url={response.currentMeet.url}
                student={response.currentMeet.student}
              />
            ) : undefined
          ) : undefined}

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
                      المعلم: {meeting.teacher || "لا يوجد"}
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
                  href="/ar/subscribe"
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
                        عنوان بريد المشرف: <span dir="ltr">{admin.gmail}</span>
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
                        {note.description.split("\n").map((line, i) => {
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
                        {note.description.split("\n").map((line, i) => {
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
              <p className="text-2xl text-center">بادر بالإنضمام إلينا</p>
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
                  إنشاء حساب
                </Link>
              </div>
            </div>
          </section>
          <article>
            <motion.div
              className="bg-white rounded-lg my-4 p-4"
              initial={{ scale: 0.5 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", mass: "0.5" }}
            >
              <p className="text-3xl text-center">
                أكاديمية تزود لتعليم القرءان الكريم وعلومه
              </p>
              <div className="flex md:gap-4 justify-center flex-col lg:flex-row">
                <div className="flex justify-center items-center">
                  <img
                    src="/static/imgs/ahmed.jpg"
                    className="my-6 min-w-64 max-w-64"
                  />
                </div>
                <div className="flex-col flex justify-center min-h-80 px-6">
                  <p className="text-2xl my-6 text-center">
                    تحت إشراف فضيلة الشيخ أحمد البيومي الأزهري
                  </p>
                  <p className="text-2xl my-6 text-center">
                    المجاز بالقراءات العشر الصغرى والحاصل على ليسانس في أصول
                    الدين والدعوة قسم التفسير وعلوم القرءان جامعة الأزهر
                  </p>
                </div>
                <div className="flex justify-center items-center">
                  <img
                    src="/static/imgs/ahmed2.jpg"
                    className="my-6 min-w-72 max-w-72"
                  />
                </div>
              </div>
            </motion.div>
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
