"use client";
import LoadingDiv from "@/app/components/loadingDiv";
import ScrollTopButton from "@/app/components/scrollTopButton";
import { arCase, arDay } from "@/app/utils/arabic";
import { almightyTrim } from "@/app/utils/string";
import { Date, Weekday } from "@/app/utils/students";
import {
  bDate,
  convertEgyptWeekdayToLocal,
  numHours,
  sortDaysFromToday,
  sumStartAndDelay,
} from "@/app/utils/time";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Meet extends Date {
  student: string;
}

const classes: { [key: string]: string } = {
  inp: "w-full p-2 border-2 border-gray-400 focus:border-sky-500 outline-0 rounded-md",
};

type Responset =
  | {
      is_accepted: true;
      meetings: Meet[];
    }
  | {
      is_accepted: false;
    }
  | null;

interface Filters {
  studentName: string;
}

const getWorkDays = (meetings: Meet[]) => {
  let rDays: Weekday[] = [];
  meetings
    .map((meeting) => meeting.day)
    .forEach((day) => {
      if (!rDays.includes(day)) {
        rDays.push(day);
      }
    });
  return rDays.sort((a, b) => sortDaysFromToday(a) - sortDaysFromToday(b));
};

const SuccesContent: React.FC<{ unfixedmeetings: Meet[] }> = ({
  unfixedmeetings,
}) => {
  const [filterOpened, setFilterOpened] = useState(true);
  const [filters, setFilters] = useState<Filters>({ studentName: "" });
  const meetings = unfixedmeetings
    .map((mt) => {
      const [day, time] = convertEgyptWeekdayToLocal(mt.day, mt.starts) as [
        Weekday,
        string
      ];
      return { ...mt, day, starts: time } as Meet;
    })
    .filter((m) =>
      arCase(m.student.toLowerCase()).includes(
        arCase(almightyTrim(filters.studentName.toLowerCase()))
      )
    );

  return (
    <>
      <div className="p-3">
        <main
          className="bg-white flex rounded-lg overflow-hidden"
          style={{ minHeight: "calc(100vh - 140px)" }}
        >
          <div
            className={`transition-all duration-500 overflow-hidden ${
              filterOpened ? "sm:w-64 w-40 flex-none" : "w-0"
            }`}
          >
            <div className="p-4">
              <input
                placeholder="إسم الطالب"
                type="text"
                className={classes["inp"]}
                value={filters.studentName}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, studentName: e.target.value }))
                }
              />
              <div className="mt-4">
                {getWorkDays(meetings).map((day, i) => (
                  <div key={i}>
                    <a
                      className="inline-block p-3 rounded-lg border-2 border-gray-600"
                      href={"#" + day}
                    >
                      {arDay(day)}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className="px-1 border-x-2 border-gray-500 cursor-pointer"
            onClick={() => setFilterOpened((o) => !o)}
          >
            <ChevronDoubleLeftIcon
              className={
                "transition-all duration-500 top-24" +
                (filterOpened ? " rotate-180" : "")
              }
              width={20}
            />
          </div>
          <div className="flex-auto p-4">
            {getWorkDays(meetings).map((day, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <p id={day}>
                  <span
                    className={
                      "p-3 text-xl rounded-lg border-2 border-gray-500 inline-block"
                    }
                  >
                    {arDay(day) +
                      (sortDaysFromToday(day) === 0 ? " (اليوم)" : "")}
                  </span>
                </p>
                <div className="mt-4 flex gap-4 flex-wrap">
                  {meetings
                    .filter((m) => m.day === day)
                    .sort((a, b) => numHours(a.starts) - numHours(b.starts))
                    .map(({ delay, starts, student }, i) => {
                      const timeNow = bDate.getTime();
                      const convertedStart = starts.slice(0, -3);
                      const convertedSum = sumStartAndDelay(starts, delay);

                      return (
                        <div key={i} className="p-2">
                          <p className="text-lg pb-2">الطالب {student}</p>
                          <p className="pb-2">
                            يبدأ الساعة {convertedStart}{" "}
                            {sortDaysFromToday(day) === 0
                              ? numHours(timeNow) > numHours(convertedStart)
                                ? numHours(timeNow) < numHours(convertedSum)
                                  ? "(الآن)"
                                  : "(إنتهت)"
                                : i === 0
                                ? "(التالي)"
                                : ""
                              : index === 0 && i === 0
                              ? "(التالي)"
                              : ""}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <ScrollTopButton />
    </>
  );
};

const TeacherContent: React.FC = () => {
  const [response, setResponse] = useState<Responset>();

  useEffect(() => {
    setResponse({
      is_accepted: true,
      meetings: [
        {
          day: "friday",
          delay: 1800,
          starts: "00:30:00",
          student: "محمد بلال",
        },
        {
          day: "tuesday",
          delay: 1800,
          starts: "14:00:00",
          student: "محمد بلال",
        },
        {
          day: "thurusday",
          delay: 1800,
          starts: "14:00:00",
          student: "محمد بلال",
        },
        {
          day: "thurusday",
          delay: 1800,
          starts: "23:00:00",
          student: "علي خالد علي",
        },
        {
          day: "wednesday",
          delay: 1800,
          starts: "02:00:00",
          student: "علي خالد علي",
        },
      ],
    });
  }, []);

  if (response === undefined) {
    return <LoadingDiv loading />;
  }

  if (response === null) {
    return;
  }

  if (!response.is_accepted || response.meetings.length === 0) {
    return (
      <div className="p-4">
        <p className="p-6 bg-white rounded-lg text-gray-600">
          {response.is_accepted
            ? "ليس لديك أي مقابلات بعد"
            : "لم يتم الموافقة عليك بعد لذلك لا يوجد أي مقابلات"}
        </p>
      </div>
    );
  }

  return <SuccesContent unfixedmeetings={response.meetings} />;
};

export default TeacherContent;
