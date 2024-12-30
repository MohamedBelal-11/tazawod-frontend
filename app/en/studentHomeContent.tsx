import globalClasses from "../utils/globalClasses";
import { Weekday } from "../utils/students";
import {
  bDate,
  convertEgyptTimeToLocalTime,
  convertEgyptWeekdayToLocal,
  hrNumber,
  numHours,
  sortDaysFromToday,
} from "../utils/time";
import { ADE, CCV } from "./content";
import { cCV, homeclasses, secondsToHrs } from "../ar/content";
import { motion } from "framer-motion";
import Link from "next/link";
import { StudentHome } from "../ar/studentHomeContent";
import { capitelize } from "../utils/string";

const StudentHomeContent: React.FC<{ student: StudentHome }> = ({
  student,
}) => {
  return (
    <>
      {student.currentMeet ? (
        <section className="bg-white rounded-lg flex flex-col gap-4 p-8 text-center">
          <p className="text-xl">
            {student.currentMeet.teacher
              ? `Teacher: ${student.currentMeet.teacher} wait you in the room`
              : "Here is the meeting a teacher will be coming in soon"}
          </p>
          <div className="flex flex-row gap-4 justify-center">
            <a
              href={"/en/meetings/meeting/" + student.currentMeet.id}
              target="_blank"
              className={
                "bg-sky-200 border-2 border-solid border-sky-500 px-4 py-3 " +
                "rounded-xl hover:text-white hover:bg-sky-500 transition-all"
              }
            >
              enter
            </a>
            <ADE copy={"/en/meetings/meeting/" + student.currentMeet.id} />
          </div>
        </section>
      ) : undefined}
      <section>
        <h2>
          <span className={globalClasses.sectionHeader}>Your lessons</span>
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
                  <p className="text-3xl font-bold">{capitelize(date.day)}</p>
                  <p className="text-2xl">
                    Starts at{" "}
                    {convertEgyptTimeToLocalTime(date.starts.slice(0, -3))}
                  </p>

                  <p>
                    Ends at{" "}
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
            You have not subscribed yet.
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
      )}
      {student.notes.length !== 0 ? (
        <section>
          <h2>
            <span className={globalClasses.sectionHeader}>Last reports</span>
          </h2>
          <div>
            {student.notes.map((note, i) => {
              return (
                <div key={i} className="p-8 bg-white rounded-3xl my-6">
                  <h3 className="flex justify-between text-2xl font-semibold">
                    <span>
                      {bDate.getFormedDate(note.date, { form: "english" })}
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
                      : "Not written yet"}
                  </div>
                  <p className="flex justify-end text-3xl font-reguler">
                    Teacher: {note.teacher}
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
