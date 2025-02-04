import globalClasses from "../utils/globalClasses";
import {
  bDate,
  convertEgyptTimeToLocalTime,
  hrNumber,
  numHours,
} from "../utils/time";
import { ADE, CCV } from "./content";
import { cCV, homeclasses, secondsToHrs } from "../ar/content";
import { motion } from "framer-motion";
import Link from "next/link";
import { TeacherHome } from "../ar/teacherHomeContent";

const TeacherHomeContent: React.FC<{ teacher: TeacherHome }> = ({
  teacher,
}) => {
  return (
    <>
      {teacher.is_accepted && teacher.currentMeet ? (
        <>
          <section className="bg-white rounded-lg flex flex-col gap-4 p-8 text-center">
            <p className="text-xl">
              You have a lesson with the student{" "}
              {teacher.currentMeet.meet.student}
            </p>
            <div className="flex flex-row gap-4 justify-center">
              <a
                href={"/en/meetings/meeting/" + teacher.currentMeet.meet.id}
                target="_blank"
                className={
                  "bg-sky-200 border-2 border-solid border-sky-500 px-4 py-3 " +
                  "rounded-xl hover:text-white hover:bg-sky-500 transition-all"
                }
              >
                Enter
              </a>
              <ADE domain copy={"/en/meetings/meeting/" + teacher.currentMeet.meet.id} />
            </div>
          </section>
          {teacher.currentMeet.last_note && (
            <section>
              <div className="p-8 bg-white rounded-3xl my-6">
                <h3 className="flex justify-between text-2xl font-semibold">
                  <span>
                    {bDate.getFormedDate(teacher.currentMeet.last_note.date, {
                      form: "english",
                    })}
                  </span>
                  <span>
                    {teacher.currentMeet.last_note.rate}/
                    <span className="text-sm">10</span>
                  </span>
                </h3>
                <div className="my-6 text-xl font-reguler">
                  {teacher.currentMeet.last_note.description
                    .split("\n")
                    .map((line, i) => {
                      return (
                        <p className="my-2" key={i}>
                          {line}
                        </p>
                      );
                    })}
                </div>
                <p className="flex justify-end text-3xl font-reguler">
                  Teacher: {teacher.currentMeet.last_note.teacher}
                </p>
              </div>
            </section>
          )}
        </>
      ) : undefined}
      {teacher.is_accepted ? (
        <section>
          <h2 className={globalClasses.sectionHeader}>Today{`'`}s lessons</h2>
          <motion.div
            className={homeclasses.cardsContainer}
            variants={cCV}
            initial="hidden"
            animate="visible"
          >
            {teacher.today_meetings.map((meeting, i) => {
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
                    Student: {meeting.student}
                  </p>
                  <p className="text-2xl">
                    Starts at{" "}
                    {convertEgyptTimeToLocalTime(meeting.starts.slice(0, -3))}
                  </p>
                  <p>
                    Ends at{" "}
                    {convertEgyptTimeToLocalTime(
                      hrNumber(
                        numHours(meeting.starts) + secondsToHrs(+meeting.delay)
                      )
                    )}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
          <h2 className={globalClasses.sectionHeader}>
            Tomorrow{`'`}s lessons
          </h2>
          <motion.div
            className={homeclasses.cardsContainer}
            variants={cCV}
            initial="hidden"
            animate="visible"
          >
            {teacher.tomorrow_meetings.map((meeting, i) => {
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
                    Student: {meeting.student}
                  </p>
                  <p className="text-2xl">
                    Starts at{" "}
                    {convertEgyptTimeToLocalTime(meeting.starts.slice(0, -3))}
                  </p>
                  <p>
                    Ends at{" "}
                    {convertEgyptTimeToLocalTime(
                      hrNumber(
                        numHours(meeting.starts) + secondsToHrs(+meeting.delay)
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
            You have not been approved yet. Please read the teacher{`'`}s guide
            until you are approved.
          </h2>
          <div className="mt-4 flex justify-center">
            <Link
              href="/en/teachers/guide"
              className={
                "px-6 py-4 bg-sky-100 rounded-2xl border-2 border-sky-400 border-solid " +
                "hover:bg-sky-400 hover:text-white transition-all"
              }
            >
              Teacher{`'`}s guide
            </Link>
          </div>
        </section>
      )}
      {!teacher.is_accepted && teacher.super_admins.length !== 0 ? (
        <section>
          <h2 className={globalClasses.sectionHeader}>
            Some of the super admin you can contact:
          </h2>
          <motion.div
            className={homeclasses.cardsContainer}
            variants={cCV}
            initial="hidden"
            animate="visible"
          >
            <div></div>
            {teacher.super_admins.map((admin, i) => {
              return (
                <motion.div
                  key={i}
                  className={
                    "px-8 rounded-lg bg-white *:my-4 *:text-nowrap py-4 block " +
                    "transition-all duration-300 w-max *:w-max"
                  }
                  variants={CCV}
                >
                  <p className="text-2xl font-bold">Admin: {admin.name}</p>
                  <p className="text-xl font-bold">
                    Admin email: <span dir="ltr">{admin.gmail}</span>
                  </p>
                </motion.div>
              );
            })}
            <div></div>
          </motion.div>
        </section>
      ) : null}
      {teacher.is_accepted && teacher.notes.length !== 0 ? (
        <section>
          <h2>
            <span className={globalClasses.sectionHeader}>Last reports</span>
          </h2>
          <div>
            {teacher.notes.map((note, i) => {
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
                    Student: {note.student}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <></>
      )}
    </>
  );
};

export default TeacherHomeContent;
