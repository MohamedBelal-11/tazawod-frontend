import { motion } from "framer-motion";
import globalClasses from "../utils/globalClasses";
import { cCV, homeclasses } from "../[lang]/content";
import { CCV } from "./content";
import { convertEgyptTimeToLocalTime, sumStartAndDelay } from "../utils/time";
import Link from "next/link";
import { AdminHome } from "../[lang]/adminHomeContent";

const AdminHomeContent: React.FC<{ admin: AdminHome }> = ({ admin }) => {
  return (
    <>
      {admin.userType === "admin" && admin.is_accepted ? (
        <section>
          <h2 className={globalClasses.sectionHeader}>Live meetings</h2>
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
                <p className="text-3xl font-bold">Student: {meeting.student}</p>
                <p className="text-3xl font-bold">
                  Teacher: {meeting.teacher || "None"}
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
                  href={"/en/meetings/meeting/" + meeting.id}
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
          You have not been approved yet. Please read the admin guide until you are approved.
          </h2>
          <div className="mt-4 flex justify-center">
            <Link
              href="/en/admins/guide"
              className={
                "px-6 py-4 bg-sky-100 rounded-2xl border-2 border-sky-500 border-solid " +
                "hover:bg-sky-500 hover:text-white transition-all"
              }
            >
              Admin guide
            </Link>
          </div>
        </section>
      )}
    </>
  );
};

export default AdminHomeContent;
