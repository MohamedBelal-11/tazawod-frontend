import { convertEgyptTimeToLocalTime } from "./time";

export const arDay = (day: string) => {
  if (day === "monday") {
    return "الإثنين";
  }
  if (day === "tuesday") {
    return "الثلاثاء";
  }
  if (day === "wednesday") {
    return "الأربعاء";
  }
  if (day === "thurusday") {
    return "الخميس";
  }
  if (day === "friday") {
    return "الجمعة";
  }
  if (day === "saturday") {
    return "السبت";
  }
  return "الأحد";
};

export const arabicWeekDays = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

export const getArabicDate = (
  date: string,
  { day = true, time = true }: { day?: boolean; time?: boolean } = {
    day: true,
    time: true,
  }
) => {
  const tdate = new Date(date);
  return (
    `${tdate.getFullYear()}/${tdate.getMonth() + 1}/${tdate.getDate()} ${
      day ? arabicWeekDays[tdate.getDay()] : ""
    }` +
    (time
      ? " " +
        convertEgyptTimeToLocalTime(
          `${tdate.getHours() < 10 ? "0" : ""}${tdate.getHours()}:${
            tdate.getMinutes() < 10 ? "0" : ""
          }${tdate.getMinutes()}`
        )
      : "")
  );
};
