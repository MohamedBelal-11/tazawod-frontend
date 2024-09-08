import globalClasses from "../utils/globalClasses";
import { StudentNoteSelf } from "../utils/note";
import { Weekday } from "../utils/students";
import {
  bDate,
  convertEgyptTimeToLocalTime,
  convertEgyptWeekdayToLocal,
  hrNumber,
  numHours,
  sortDaysFromToday,
} from "../utils/time";
import { ADE, cCV, CCV, homeclasses, secondsToHrs } from "./content";
import { MeetDate } from "../utils/students";
import { motion } from "framer-motion";
import { arDay } from "../utils/arabic";
import Link from "next/link";

export type StudentHome = {
  succes: true;
  userType: "student";
  quraan_days: MeetDate[];
  subscribed: boolean;
  currentMeet: { url: string; teacher: string | null } | null;
  notes: StudentNoteSelf[];
};

const StudentHomeContent: React.FC<{ student: StudentHome }> = ({
  student,
}) => {
  return (
    <>
      {student.currentMeet ? (
        <section className="bg-white rounded-lg flex flex-col gap-4 p-8 text-center">
          <p className="text-xl">
            {student.currentMeet.teacher
              ? `المعلم: ${student.currentMeet.teacher} ينتظرك في الغرفة`
              : "ها هي المقابلة سيدخل معلم قريبًا"}
          </p>
          <div className="flex flex-row gap-4 justify-center">
            <a
              href={student.currentMeet.url}
              target="_blank"
              className={
                "bg-sky-200 border-2 border-solid border-sky-500 px-4 py-3 " +
                "rounded-xl hover:text-white hover:bg-sky-500 transition-all"
              }
            >
              دخول
            </a>
            <ADE copy={student.currentMeet.url} />
          </div>
        </section>
      ) : undefined}
      <section>
        <h2>
          <span className={globalClasses.sectionHeader}>دروسك</span>
        </h2>
        <motion.div
          className={homeclasses.cardsContainer}
          variants={cCV}
          initial="hidden"
          animate="visible"
        >
          {student.quraan_days
            .map((mt) => {
              const [day, time] = convertEgyptWeekdayToLocal(
                mt.day,
                mt.starts
              ) as [Weekday, string];
              return { ...mt, day, starts: time };
            })
            .sort((a, b) => sortDaysFromToday(a.day) - sortDaysFromToday(b.day))
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
                      hrNumber(numHours(date.starts) + secondsToHrs(date.delay))
                    )}
                  </p>
                </motion.div>
              );
            })}
        </motion.div>
      </section>
      {!student.subscribed && (
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
      )}
      {student.notes.length !== 0 ? (
        <section>
          <h2>
            <span className={globalClasses.sectionHeader}>آخر التقارير</span>
          </h2>
          <div>
            {student.notes.map((note, i) => {
              return (
                <div key={i} className="p-8 bg-white rounded-3xl my-6">
                  <h3 className="flex justify-between text-2xl font-semibold">
                    <span>
                      {bDate.getFormedDate(note.date, { form: "arabic" })}
                    </span>
                    <span>
                      {note.written ? note.rate : "-"}/
                      <span className="text-sm">10</span>
                    </span>
                  </h3>
                  <div className="my-6 text-xl font-reguler">
                    {note.written
                      ? note.description.split("\n").map((line, i) => {
                          return (
                            <p className="my-2" key={i}>
                              {line}
                            </p>
                          );
                        })
                      : "لم يكتب بعد"}
                  </div>
                  <p className="flex justify-end text-3xl font-reguler">
                    المعلم: {note.teacher}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      ) : undefined}
    </>
  );
};

export default StudentHomeContent;
