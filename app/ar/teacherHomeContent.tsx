import globalClasses from "../utils/globalClasses";
import {
  bDate,
  convertEgyptTimeToLocalTime,
  hrNumber,
  numHours,
} from "../utils/time";
import { ADE, cCV, CCV, homeclasses, secondsToHrs } from "./content";
import { motion } from "framer-motion";
import Link from "next/link";
import { TeacherNoteSelf } from "../utils/note";
import OptionsDiv from "../components/optionsDiv";

type meeting = {
  student: string;
  starts: string;
  delay: number;
};

export type TeacherHome =
  | {
      succes: true;
      userType: "teacher";
      is_accepted: false;
      super_admins: { name: string; gmail: string }[];
      id: string;
    }
  | {
      succes: true;
      userType: "teacher";
      is_accepted: true;
      today_meetings: meeting[];
      tomorrow_meetings: meeting[];
      currentMeet: {
        meet: { url: string; student: string };
        last_note: {
          teacher: string;
          rate: number;
          description: string;
          date: string;
        } | null;
      } | null;
      notes: TeacherNoteSelf[];
      id: string;
    };

const TeacherHomeContent: React.FC<{ teacher: TeacherHome }> = ({
  teacher,
}) => {
  return (
    <>
      {teacher.is_accepted && teacher.currentMeet ? (
        <>
          <section className="bg-white rounded-lg flex flex-col gap-4 p-8 text-center">
            <p className="text-xl">
              لديك حصة مع الطالب {teacher.currentMeet.meet.student}
            </p>
            <div className="flex flex-row gap-4 justify-center">
              <a
                href={teacher.currentMeet.meet.url}
                target="_blank"
                className={
                  "bg-sky-200 border-2 border-solid border-sky-500 px-4 py-3 " +
                  "rounded-xl hover:text-white hover:bg-sky-500 transition-all"
                }
              >
                دخول
              </a>
              <ADE copy={teacher.currentMeet.meet.url} />
            </div>
          </section>
          {teacher.currentMeet.last_note && (
            <section>
              <div className="p-8 bg-white rounded-3xl my-6">
                <h3 className="flex justify-between text-2xl font-semibold">
                  <span>
                    {bDate.getFormedDate(teacher.currentMeet.last_note.date, {
                      form: "arabic",
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
                  المعلم: {teacher.currentMeet.last_note.teacher}
                </p>
              </div>
            </section>
          )}
        </>
      ) : undefined}
      {teacher.is_accepted ? (
        <section className="mb-4">
          <h2 className={globalClasses.sectionHeader}>دروس اليوم</h2>
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
                    الطالب: {meeting.student}
                  </p>
                  <p className="text-2xl">
                    يبدأ الساعة{" "}
                    {convertEgyptTimeToLocalTime(meeting.starts.slice(0, -3))}
                  </p>
                  <p>
                    ينتهي الساعة{" "}
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
          <h2 className={globalClasses.sectionHeader}>دروس الغد</h2>
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
                    الطالب: {meeting.student}
                  </p>
                  <p className="text-2xl">
                    يبدأ الساعة{" "}
                    {convertEgyptTimeToLocalTime(meeting.starts.slice(0, -3))}
                  </p>
                  <p>
                    ينتهي الساعة{" "}
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
            لم يتم الموافقة عليك بعد أرجو أن تقوم بقراءة دليل المعلم حتى يتم
            الموافقة عليك
          </h2>
          <div className="mt-4 flex justify-center">
            <Link
              href="/ar/teachers/guide"
              className={
                "px-6 py-4 bg-sky-100 rounded-2xl border-2 border-sky-400 border-solid " +
                "hover:bg-sky-400 hover:text-white transition-all"
              }
            >
              دليل المعلم
            </Link>
          </div>
        </section>
      )}
      {!teacher.is_accepted && teacher.super_admins.length !== 0 ? (
        <section className="mb-4">
          <h2 className={globalClasses.sectionHeader}>
            بعض الشرفين الكبار الذين يمكنك التواصل معهم
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
      ) : undefined}
      {teacher.is_accepted && teacher.notes.length !== 0 ? (
        <section className="mb-4">
          <h2>
            <span className={globalClasses.sectionHeader}>آخر التقارير</span>
          </h2>
          <div>
            {teacher.notes.map((note, i) => {
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
                    الطالب: {note.student}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      ) : undefined}
      <OptionsDiv
        options={[
          {
            titled: "المقابلات",
            description: "جميع مقابلاتك الإسبوعية",
            href: "/ar/meetings",
          },
          {
            titled: "دليل المعلم",
            description: "الواجبات التي يجب عليك الإلتزام بها",
            href: "/ar/teachers/guide",
          },
          {
            titled: "الحساب",
            description: "رؤية وتعديل ملفك الشخصي",
            href: `/ar/teachers/teacher/${teacher.id}`,
          },
          {
            titled: "الدروس المقطعية",
            description: "شاهد دروس مقطية في أي وقت",
            href: "/ar/watch/playlists",
          },
          {
            titled: "التقارير",
            description: "آخر التقييمات والملاحظات الخاصة بك",
            href: `/ar/teachers/teacher/${teacher.id}/notes`,
          },
        ]}
      />
    </>
  );
};

export default TeacherHomeContent;
