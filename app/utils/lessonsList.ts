type weekDay =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thurusday"
  | "friday"
  | "saturday";

type lesson = {
  id: number;
  title: string;
  discription?: string | null;
  teacher?: string | null;
  gender: "male" | "female";
  price: number;
  days: weekDay[];
  time?: string;
};

export const arabicWeekday = (day: weekDay) => {
  if (day === "sunday") {
    return "الأحد";
  }
  if (day === "friday") {
    return "الجمعة";
  }
  if (day === "monday") {
    return "الإثنين";
  }
  if (day === "saturday") {
    return "السبت";
  }
  if (day === "thurusday") {
    return "الخميس";
  }
  if (day === "tuesday") {
    return "الثلاثاء";
  }
  return "الأربعاء";
};

export const timeString = (time: number) => {
  return `${time < 13 ? Math.floor(time) : Math.floor(time - 12)}:${
    Math.round((time - Math.floor(time)) * 60) < 10
      ? "0" + Math.round((time - Math.floor(time)) * 60).toString()
      : Math.round((time - Math.floor(time)) * 60)
  } ${time < 13 ? "AM" : "PM"}`;
};

export const arabicWeekList = (daylist: weekDay[]) => {
  let list = [];
  for (let i = 0; i < daylist.length; i++) {
    list[i] = arabicWeekday(daylist[i]);
  }
  return list;
};

const lessonsList: lesson[] = [
  {
    id: 1,
    title: "حلقة تحفيظ قرآن",
    discription: "",
    teacher: "محمود جمال",
    gender: "male",
    price: 100,
    days: ["friday", "sunday", "wednesday"],
    time: "3:30",
  },
  {
    id: 2,
    title: "حلقة تعليم تجويد",
    discription: "",
    gender: "female",
    price: 100,
    days: ["sunday", "tuesday", "thurusday"],
  },
  {
    id: 3,
    title: "حلقة تلاوة وتفسير",
    discription: "",
    teacher: "إبراهيم بلال",
    gender: "male",
    price: 100,
    days: ["friday"],
  },
  {
    id: 3,
    title: "حلقة تلاوة وتفسير",
    discription: "",
    gender: "female",
    price: 50,
    days: ["sunday", "wednesday"],
  },
];
export default lessonsList;
