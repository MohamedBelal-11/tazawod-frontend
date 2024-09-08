/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import globalClasses from "../utils/globalClasses";
import { motion, Variants } from "framer-motion";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import StudentHomeContent, { StudentHome } from "./studentHomeContent";
import AdminHomeContent, { AdminHome } from "./adminHomeContent";
import TeacherHomeContent, { TeacherHome } from "./teacherHomeContent";
import { fetchResponse } from "../utils/response";
import { convertEgyptTimeToLocalTime, sumStartAndDelay } from "../utils/time";

export const ADE = ({ copy }: { copy: string }) => {
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

export const secondsToHrs = (seconds: number) => {
  return seconds / 60 / 60;
};

export type adminMeeting = {
  teacher: string | null;
  starts: string;
  student: string;
  delay: number;
  url: string;
};

type responset =
  | StudentHome
  | AdminHome
  | TeacherHome
  | {
      succes: true;
      userType: "superadmin";
      live_meetings: adminMeeting[];
    }
  | {
      succes: false;
      error: number;
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

export const homeclasses = {
  header:
    "w-full flex justify-center items-center flex-nowrap gap-4 sm:gap-8 bg-white py-20",
  cardsContainer: "flex flex-nowrap gap-4 py-12 w-full overflow-x-auto",
};

export const cCV: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const CCV: Variants = {
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
    fetchResponse({ setResponse, url: "/api/home/" });
  }, []);

  return (
    <>
      <header className={homeclasses.header}>
        <img src="/static/imgs/logo-green.png" className="max-w-lg w-3/5" />
        <img src="/static/imgs/quraan.png" className="max-w-48 w-1/6" />
      </header>
      <main className={globalClasses.main}>
        {!(response && response.succes) ? (
          <>
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
          </>
        ) : response.userType === "student" ? (
          <StudentHomeContent student={response} />
        ) : response.userType === "teacher" ? (
          <TeacherHomeContent teacher={response} />
        ) : response.userType === "admin" ? (
          <AdminHomeContent admin={response} />
        ) : (
          <section>
            <h2 className={globalClasses.sectionHeader}>الدروس المباشرة</h2>
            <motion.div
              className={homeclasses.cardsContainer}
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
        )}
      </main>
    </>
  );
}
