import { motion } from "framer-motion";
import globalClasses from "../utils/globalClasses";
import { adminMeeting, cCV, CCV, homeclasses } from "./content";
import { convertEgyptTimeToLocalTime, sumStartAndDelay } from "../utils/time";
import Link from "next/link";

export type AdminHome =
  | {
      succes: true;
      userType: "admin";
      is_accepted: true;
      live_meetings: adminMeeting[];
    }
  | {
      succes: true;
      userType: "teacher";
      is_accepted: false;
      super_admins: { name: string; gmail: string }[];
    };

const AdminHomeContent: React.FC<{ admin: AdminHome }> = ({ admin }) => {
  return (
    <>
      {admin.userType === "admin" && admin.is_accepted ? (
        <section>
          <h2 className={globalClasses.sectionHeader}>الدروس المباشرة</h2>
          <motion.div
            className={homeclasses.cardsContainer}
            variants={cCV}
            initial="hidden"
            animate="visible"
          >
            {admin.live_meetings.map((meeting, i) => (
              <motion.div
                key={i}
                className={
                  "px-8 rounded-lg bg-white *:my-4 *:text-nowrap py-4 block " +
                  "transition-all duration-300 w-max *:w-max"
                }
                variants={CCV}
              >
                <p className="text-3xl font-bold">الطالب: {meeting.student}</p>
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
            لم يتم الموافقة عليك بعد أرجو أن تقوم بقراءة دليل المشرف حتى يتم
            الموافقة عليك
          </h2>
          <div className="mt-4 flex justify-center">
            <Link
              href="/ar/admins/guide"
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
    </>
  );
};

export default AdminHomeContent;
