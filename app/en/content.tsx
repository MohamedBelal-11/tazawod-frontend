/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import globalClasses from "../utils/globalClasses";
import { MeetDate, Weekday } from "../utils/students";
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
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

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

const MC2 = ({ url, student }: { url: string; student: string }) => {
  return (
    <section className="bg-white rounded-lg flex flex-col gap-4 items-center p-8 text-center">
      <p className="text-xl">You have a lesson with the student {student}</p>
      <p className="text-xl">رابط المقابلة</p>
      <p
        dir="ltr"
        className={
          "outline-0 border-gray-500 p-3 max-w-96 w-full " +
          "border-solid border-2 rounded-lg bg-gray-300"
        }
      >
        {url}
      </p>
      <div className="flex flex-row gap-4 justify-center">
        <a
          href={url}
          target="_blank"
          className={
            "bg-sky-200 border-2 border-solid border-sky-500 px-4 py-3 " +
            "rounded-xl hover:text-white hover:bg-sky-500 transition-all"
          }
        >
          enter
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
      quraan_days: MeetDate[];
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
      quraan_days: MeetDate[];
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
                    ? `Teacher: ${response.currentMeet.teacher} is waiting for you in the room`
                    : "Here is the meeting, a teacher will join soon"}
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
                <span className={globalClasses.sectionHeader}>
                  Your lessons
                </span>
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
                          Starts at {date.starts.slice(0, -3)}
                        </p>

                        <p>
                          Ends at{" "}
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
                <h2 className={globalClasses.sectionHeader}>
                  Today{"'"}s lesson
                </h2>
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
                          t The student: {meeting.student}
                        </p>
                        <p className="text-2xl">
                          Starts at{" "}
                          {convertEgyptTimeToLocalTime(
                            meeting.starts.slice(0, -3)
                          )}
                        </p>
                        <p>
                          Ends at{" "}
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
                <h2 className={globalClasses.sectionHeader}>
                  Tomorrow{"'"}s lessons
                </h2>
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
                          The student: {meeting.student}
                        </p>
                        <p className="text-2xl">
                          Starts at{" "}
                          {convertEgyptTimeToLocalTime(
                            meeting.starts.slice(0, -3)
                          )}
                        </p>
                        <p>
                          Ends at{" "}
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
                  You have not been approved yet. Please read the teacher{"'"}s
                  guide until you are approved.
                </h2>
                <div className="mt-4 flex justify-center">
                  <Link
                    href="/en/teachers/guide"
                    className={
                      "px-6 py-4 bg-sky-100 rounded-2xl border-2 border-sky-400 border-solid " +
                      "hover:bg-sky-400 hover:text-white transition-all"
                    }
                  >
                    Teacher{"'"}s guide
                  </Link>
                </div>
              </section>
            )
          ) : (response.userType === "admin" && response.is_accepted) ||
            response.userType === "superadmin" ? (
            <section>
              <h2 className={globalClasses.sectionHeader}>Live Meetings</h2>
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
                      The student: {meeting.student}
                    </p>
                    <p className="text-3xl font-bold">
                      The Teacher: {meeting.teacher || "لا يوجد"}
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
          ) : (
            <section className="md:m-8 rounded-xl bg-white p-6">
              <h2 className="text-xl font-bold text-center">
                You have not been approved yet. Please read the admin{"'"}s
                guide until you are approved.
              </h2>
              <div className="mt-4 flex justify-center">
                <Link
                  href="/en/admins/guide"
                  className={
                    "px-6 py-4 bg-sky-100 rounded-2xl border-2 border-sky-500 border-solid " +
                    "hover:bg-sky-500 hover:text-white transition-all"
                  }
                >
                  Admin{"'"}s guide
                </Link>
              </div>
            </section>
          )}

          {response.userType === "student" && !response.subscribed ? (
            <section className="p-8 rounded-3xl bg-white">
              <h2 className="text-3xl font-bold text-center">
                You are not subscribed yet.
              </h2>
              <div className="mt-4 flex justify-evenly">
                <Link
                  href="/en/subscribe"
                  className={
                    "p-8 bg-yellow-100 rounded-2xl border-2 border-yellow-400 " +
                    "border-solid hover:bg-yellow-400 transition-all"
                  }
                >
                  Subscribe
                </Link>
              </div>
            </section>
          ) : (response.userType === "teacher" ||
              response.userType === "admin") &&
            !response.is_accepted &&
            response.super_admins.length !== 0 ? (
            <section>
              <h2 className={globalClasses.sectionHeader}>
                Some of the super admins you can contact:
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
                      <p className="text-2xl font-bold">
                        The admin: {admin.name}
                      </p>
                      <p className="text-xl font-bold">
                        Admin Email: <span dir="ltr">{admin.gmail}</span>
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
                  Last reports
                </span>
              </h2>
              <div>
                {response.notes.map((note, i) => {
                  return (
                    <div key={i} className="p-8 bg-white rounded-3xl my-6">
                      <h3 className="flex justify-between text-2xl font-semibold">
                        <span>
                          {bDate.getFormedDate(note.date, { form: "english" })}
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
                        The teacher: {note.teacher}
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
                  Last reports
                </span>
              </h2>
              <div>
                {response.notes.map((note, i) => {
                  return (
                    <div key={i} className="p-8 bg-white rounded-3xl my-6">
                      <h3 className="flex justify-between text-2xl font-semibold">
                        <span>
                          {bDate.getFormedDate(note.date, { form: "english" })}
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
                        The student: {note.student}
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
        </main>
      )}
    </>
  );
}
