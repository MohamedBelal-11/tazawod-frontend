"use client";
import ArabicLayout from "@/app/components/arabicLayout";
import LoadingDiv from "@/app/components/loadingDiv";
import { secondsToHrs } from "@/app/content";
import { arDay } from "@/app/utils/arabic";
import { get } from "@/app/utils/docQuery";
import { sum } from "@/app/utils/number";
import { date, weekday } from "@/app/utils/students";
import { convertEgyptTimeToLocalTime, hrNumber } from "@/app/utils/time";
import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface tdate extends date {
  price: number;
}

const classes: { [key: string]: string } = {
  td: "sm:text-2xl border-2 border-solid border-gray-500 sm:p-4 p-1 text-center",
  section: "rounded-xl bg-white border-4 border-solid border-gray-500 ",
};
// declare response type
type responset =
  | {
      succes: true;
      userType: "self" | "admin" | "superadmin";
      name: string;
      phone: string;
      subscribed: boolean;
      dates: tdate[];
      note: {
        teacher: string;
        rate: number;
        discription: string | null;
        day: weekday;
        date: string;
      };
      gender: "male" | "female";
      teacher: string | null;
      currency: "EGP" | "USD";
    }
  | {
      succes: false;
      error: number;
    }
  | null;

const Content = () => {
  // crete response state
  const [response, setResponse] = useState<responset>();
  const { id }: { id: string } = useParams();
  // create load state
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setResponse({
      succes: true,
      dates: [
        {
          day: "sunday",
          starts: "07:00:00",
          delay: 1800,
          price: 50,
        },
        {
          day: "tuesday",
          starts: "07:00:00",
          delay: 1800,
          price: 50,
        },
        {
          day: "thurusday",
          starts: "07:00:00",
          delay: 1800,
          price: 50,
        },
      ],
      gender: "male",
      name: "محمد بلال",
      note: {
        date: "27/11/2023",
        day: "sunday",
        discription: "إلخ إلخ إلخ\ngggg\nggg",
        rate: 9,
        teacher: "محمود جمال",
      },
      phone: "201283410254",
      subscribed: true,
      teacher: "محمد علي",
      userType: "admin",
      currency: "EGP",
    });
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (response && response.succes) {
      get<HTMLTitleElement>("title", 0, 0).forEach(({ innerHTML }) => {
        innerHTML = `الطالب ${response.name} - أكاديمية تزود`;
      });
    }
  }, [response]);

  return (
    <ArabicLayout>
      <LoadingDiv loading={!loaded} />

      {response ? (
        response.succes ? (
          <main className="sm:px-8 sm:py-4 py-2">
            <section className={classes["section"] + "p-4 mb-2"}>
              {/* dispaly name */}
              <h1
                className={`sm:text-4xl text-2xl font-bold mb-4${
                  response.userType === "self"
                    ? " flex items-center justify-between"
                    : ""
                }`}
              >
                {response.userType === "self" ? (
                  <>
                    <span>{response.name}</span>
                    <span
                      className={
                        "p-2 rounded-full border-2 border-solid border-gray-500 " +
                        "duration-300 cursor-pointer hover:bg-sky-600 hover:text-white " +
                        "transition-all hover:border-sky-600"
                      }
                      title="تعديل"
                    >
                      <PencilIcon width={20} />
                    </span>
                  </>
                ) : (
                  response.name
                )}
              </h1>
              {/* display phone number */}
              <h2 className="sm:text-3xl text-xl mt-4 font-bold">
                <span dir="ltr">+{response.phone}</span>
              </h2>
              {/* dispaly subscribing */}
              <div className="flex gap-8 items-center">
                <p className="text-2xl my-4">
                  {response.subscribed ? "مشترك" : "غير مشترك"}
                </p>
                {/* subscribe button */}
                {!response.subscribed &&
                  (response.userType === "self" ? (
                    // if self display the link to subscribe page
                    <Link
                      href=""
                      className={
                        "p-2 border-2 border-green-500 bg-green-200 " +
                        "hover:text-white hover:bg-green-500 border-solid " +
                        "rounded-lg transition-all duration-300 flex items-center"
                      }
                    >
                      إشتراك
                    </Link>
                  ) : (
                    // else display button that make request to subscribing url
                    <button
                      className={
                        "p-2 border-2 border-green-500 bg-green-200 " +
                        "hover:text-white hover:bg-green-500 border-solid " +
                        "rounded-lg transition-all duration-300"
                      }
                    >
                      إشتراك
                    </button>
                  ))}
              </div>
              {/* display the teacher */}
              <p className="text-xl mb-2">
                المعلم:{" "}
                {!response.teacher && response.subscribed ? (
                  // if there isn't teacher and is subscribed color by red
                  <span className="text-red-500">لا يوجد</span>
                ) : (
                  // else keep it black
                  response.teacher || "لا يوجد"
                )}
              </p>
              {response.userType !== "self" && response.subscribed && (
                // if the user is admin or super admin display change teacher button
                <div>
                  <button
                    className={
                      "p-2 border-2 border-sky-500 bg-sky-200 " +
                      "hover:text-white hover:bg-sky-500 border-solid " +
                      "rounded-lg transition-all duration-300 my-2"
                    }
                  >
                    {response.teacher ? "تغيير المعلم" : "إختيار معلم"}
                  </button>
                  {!response.teacher && (
                    // if subscribed push him
                    <span className="inline-block mr-4">يجب عليك هذا</span>
                  )}
                </div>
              )}
            </section>
            <section className={classes["section"] + "p-4 my-2 w-auto"}>
              <p className="text-3xl mb-4">المواعيد</p>
              <div className="w-full overflow-x-auto">
                <table className="overflow-x-scroll w-full">
                  <thead>
                    <tr>
                      <th className={classes["td"]}>اليوم</th>
                      <th className={classes["td"]}>يبدأ</th>
                      <th className={classes["td"]}>المدة</th>
                      <th className={classes["td"]}>السعر</th>
                    </tr>
                  </thead>
                  <tbody>
                    {response.dates.map((date, i) => (
                      <tr key={i}>
                        <td className={classes["td"]}>{arDay(date.day)}</td>
                        <td className={classes["td"]}>
                          {convertEgyptTimeToLocalTime(
                            date.starts.slice(0, -3)
                          )}
                        </td>
                        <td className={classes["td"]}>
                          {hrNumber(secondsToHrs(date.delay))}
                        </td>
                        <td className={classes["td"]}>
                          {date.price}{" "}
                          {response.currency === "EGP"
                            ? "جنيه مصري"
                            : "دولار أمريكي"}{" "}
                          شهريًا
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className={classes["td"]}>الإجمالي</td>
                      <td colSpan={3} className={classes["td"]}>
                        {sum(response.dates.map(({ price }) => price))}{" "}
                        {response.currency === "EGP"
                          ? "جنيه مصري"
                          : "دولار أمريكي"}{" "}
                        شهريًا
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            <section className={classes["section"] + "mt-2 overflow-hidden"}>
              <div className="p-4">
                <div>
                  <div className="flex justify-between">
                    <p className="sm:text-2xl">
                      {`${arDay(response.note.day)}  ${response.note.date}`}
                    </p>
                    <p className="sm:text-2xl">
                      {response.note.rate}\
                      <span className="sm:text-lg text-sm">10</span>
                    </p>
                  </div>
                  <div className="p-4">
                    {response.note.discription
                      ? response.note.discription.split("\n").map((line, i) => (
                          <p key={i} className="sm:text-xl my-2">
                            {line.trim()}
                          </p>
                        ))
                      : "لم يتم كتابة تقرير"}
                  </div>
                  <p className="sm:text-2xl text-lg">
                    المعلم: {response.note.teacher}
                  </p>
                </div>
              </div>
              <Link
                href={`/students/student/${id}/notes`}
                className={
                  "border-t-2 border-solid border-gray-600 block " +
                  "p-4 text-center hover:bg-gray-200 transition-all duration-300"
                }
              >
                إظهار الكل
              </Link>
            </section>
          </main>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </ArabicLayout>
  );
};

export default Content;
