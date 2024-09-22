/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import globalClasses from "../utils/globalClasses";
import { motion, Variants } from "framer-motion";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { StudentHome } from "../ar/studentHomeContent";
import StudentHomeContent from "./studentHomeContent";
import AdminHomeContent from "./adminHomeContent";
import { AdminHome } from "../ar/adminHomeContent";
import TeacherHomeContent from "./teacherHomeContent";
import { TeacherHome } from "../ar/teacherHomeContent";
import { fetchResponse } from "../utils/response";
import { convertEgyptTimeToLocalTime, sumStartAndDelay } from "../utils/time";
import { adminMeeting, cCV, homeclasses } from "../ar/content";

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
              span.innerText = "copied";
              setTimeout(() => {
                span.innerText = "copy";
              }, 5000);
            }
          })
          .catch((e) => {
            if (span) {
              span.innerText = "failed" + String(e);
              setTimeout(() => {
                span.innerText = "copy";
              }, 5000);
            }
          });
      }}
    >
      <span>copy</span>
      <DocumentDuplicateIcon width={20} />
    </button>
  );
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
    header: "Comprehensive and rigorous methodology",
    description:
      "The Academy provides an integrated curriculum for memorizing the Holy Quran, " +
      "It includes the rules of Tajweed and recitation, with a logical progression in memorization and recitation.\n" +
      "The curriculum includes clear divisions of verses and surahs, " +
      "Which makes it easy for learners to achieve continuous and organized progress.",
  },
  {
    header: "Modern Technologies",
    description:
      "The platform uses the latest technologies in e-learning, " +
      "including high-quality audio and video, to support the learning experience.\n" +
      "Tazawod Academy provides interactive tools such as " +
      "flashcards and short quizzes to enhance understanding and retention.",
  },
  {
    header: "Individual Lessons",
    description:
      "Students can choose between individual learning sessions with a specialized instructor.",
  },
  {
    header: "Continuous Monitoring and Evaluation",
    description:
      "Tazawod Academy tracks students' progress through a " +
      "precise evaluation system, including periodic tests and personal assessments.\n" +
      "The student receives continuous feedback from instructors to improve performance and ensure progress.",
  },
  {
    header: "Scheduling Flexibility",
    description:
      "Students can schedule their sessions at their preferred times without any restrictions.",
  },
];

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
                <p className="text-2xl text-center">Join us</p>
                <div className="flex justify-center gap-4 mt-8">
                  <Link
                    className="p-2 rounded-xl block bg-gray-300"
                    href="/en/auth/login"
                  >
                    Login
                  </Link>
                  <Link
                    className="p-2 rounded-xl block bg-green-600 border-green-600 text-white"
                    href="/en/auth/register/student"
                  >
                    Sign up
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
                Tazawad Academy for teaching the Holy Quran and its sciences
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
                    Under the supervision of His Eminence Sheikh Ahmed
                    Al-Bayoumi Al-Azhari
                    </p>
                    <p className="text-2xl my-6 text-center">
                  Licensed in the ten minor readings and holds a BA in the Fundamentals of Religion and Da{"'"}wah, Department of Interpretation and Qur{"’"}anic Sciences, Al-Azhar University
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
                initial={{ x: "-45%", scale: 0.7 }}
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
            <h2 className={globalClasses.sectionHeader}>Live meetings</h2>
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
                    Student: {meeting.student}
                  </p>
                  <p className="text-3xl font-bold">
                    Teacher: {meeting.teacher || "لا يوجد"}
                  </p>
                  <p className="text-2xl">
                    Starts at{" "}
                    {convertEgyptTimeToLocalTime(meeting.starts.slice(0, -3))}
                  </p>
                  <p>
                    Ends at{" "}
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
                    Enter the meeting
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
