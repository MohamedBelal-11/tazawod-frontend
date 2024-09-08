export const numHours = (time: string) => {
  let [hours, minutes, secondes = null] = time.split(":").map(Number);
  return hours + minutes / 60 + (secondes ? secondes / 60 / 60 : 0);
};

export const hrNumber = (number: number) => {
  let mins = String(Math.round((number - Math.floor(number)) * 60));
  let hrs = String(Math.floor(number));
  return (
    (hrs.length === 1 ? "0" + hrs : hrs) + ":" + (mins === "0" ? "00" : mins)
  );
};

export const isBetween = (
  starts: [string, Weekday],
  delay: string,
  starts2: [string, Weekday],
  delay2: string
) => {
  const started = starts[0].split(":").map(Number);
  const dalyed = delay.split(":").map(Number);
  const started2 = starts2[0].split(":").map(Number);
  const dalyed2 = delay2.split(":").map(Number);

  const startDate = DateTime.fromObject({
    year: 2024,
    month: 7,
    day: days.indexOf(starts[1]) === 0 ? 7 : days.indexOf(starts[1]), // Specific date
    hour: started[0],
    minute: started[1],
    second: started[2] || 0,
  });

  const EndDate = startDate.plus({
    hours: dalyed[0],
    minutes: dalyed[1],
    seconds: dalyed[2] || undefined,
  });

  const startDate2 = DateTime.fromObject({
    year: 2024,
    month: 7,
    day: days.indexOf(starts2[1]) === 0 ? 7 : days.indexOf(starts2[1]), // Specific date
    hour: started2[0],
    minute: started2[1],
    second: started2[2] || 0,
  });

  const EndDate2 = startDate2.plus({
    hours: dalyed2[0],
    minutes: dalyed2[1],
    seconds: dalyed2[2] || undefined,
  });

  return (
    (startDate2 > startDate && startDate2 < EndDate) ||
    (EndDate2 > startDate && EndDate2 < EndDate) ||
    (startDate > startDate2 && startDate < EndDate2) ||
    (EndDate > startDate2 && EndDate < EndDate2) ||
    (startDate.weekday === 7
      ? (startDate.minus({ days: 7 }) > startDate2 &&
          startDate.minus({ days: 7 }) < EndDate2) ||
        (EndDate.minus({ days: 7 }) > startDate2 &&
          EndDate.minus({ days: 7 }) < EndDate2)
      : false) ||
    (startDate2.weekday === 7
      ? (startDate2.minus({ days: 7 }) > startDate &&
          startDate2.minus({ days: 7 }) < EndDate) ||
        (EndDate2.minus({ days: 7 }) > startDate &&
          EndDate2.minus({ days: 7 }) < EndDate)
      : false)
  );
};

export const convertLocalDateTimeToEgypt = (localDateTimeString: string) => {
  // Parse the input date-time string in local time zone
  const localDateTime = DateTime.fromISO(localDateTimeString, {
    zone: DateTime.local().zoneName,
  });

  // Convert to Egypt time zone
  const egyptDateTime = localDateTime.setZone("Africa/Cairo");

  return egyptDateTime.toISO(); // Return as ISO string
};

export const convertEgyptDateTimeToLocal = (egyptDateTimeString: string) => {
  // Parse the input date-time string in Egypt time zone
  const egyptDateTime = DateTime.fromISO(egyptDateTimeString, {
    zone: "Africa/Cairo",
  });

  // Convert to local time zone
  const localDateTime = egyptDateTime.setZone(DateTime.local().zoneName);

  return localDateTime.toISO(); // Return as ISO string
};

export const convertLocalWeekdayToEgypt = (
  localWeekday: Weekday,
  time: string
) => {
  const [hour, minute, socends = null] = time.split(":").map(Number);

  const localeDateTime = DateTime.fromObject({
    year: 2024,
    month: 7,
    day: days.indexOf(localWeekday) === 0 ? 7 : days.indexOf(localWeekday), // Specific date
    hour,
    minute,
    second: socends || 0,
  });
  // Convert to Egypt time
  const EgyptDateTime = localeDateTime.setZone("Africa/Cairo");

  // Get the day and time in Egypt time zone
  const dayInEgypt =
    days[EgyptDateTime.weekday === 7 ? 0 : EgyptDateTime.weekday]; // Full day name
  const timeInEgypt = EgyptDateTime.toFormat("HH:mm:ss"); // Time in HH:mm:ss format

  return [dayInEgypt, timeInEgypt] as [Weekday, string];
};

export const convertEgyptWeekdayToLocal = (
  localWeekday: Weekday,
  time: string
) => {
  const [hour, minute, socends = null] = time.split(":").map(Number);

  const egyptDateTime = DateTime.fromObject({
    year: 2024,
    month: 7,
    day: days.indexOf(localWeekday) === 0 ? 7 : days.indexOf(localWeekday), // Specific date
    hour,
    minute,
    second: socends || 0,
  }).setZone("Africa/Cairo", { keepLocalTime: true });
  // Convert to your local time
  const localDateTime = egyptDateTime.setZone(DateTime.local().zoneName);

  // Get the day and time in your local time zone
  const dayInLocal =
    days[localDateTime.weekday === 7 ? 0 : localDateTime.weekday]; // Full day name
  const timeInLocal = localDateTime.toFormat("HH:mm:ss"); // Time in HH:mm:ss format

  return [dayInLocal, timeInLocal] as [Weekday, string];
};

export const sortDaysFromToday = (day: Weekday) => {
  const today = bDate.getDay({ form: "number" }) as number;
  if (today == days.indexOf(day)) {
    return 0;
  } else if (today > days.indexOf(day)) {
    return 7 + (days.indexOf(day) - today);
  } else {
    return days.indexOf(day) - today;
  }
};

import { DateTime } from "luxon";
import { Weekday } from "./students";
import { arabicMonths, arabicWeekDays } from "./arabic";
import { secondsToHrs } from "../ar/content";

// Convert local time to Egypt time
function convertLocalTimeToEgyptTime(localTimeString: string): string {
  const localTime = DateTime.fromFormat(localTimeString, "HH:mm");
  const egyptTime = localTime.setZone("Africa/Cairo", { keepLocalTime: true });
  return egyptTime.toFormat("HH:mm");
}

// Convert Egypt time to local time
function convertEgyptTimeToLocalTime(egyptTimeString: string): string {
  const egyptTime = DateTime.fromFormat(egyptTimeString, "HH:mm", {
    zone: "Africa/Cairo",
  });
  const localTime = egyptTime.setZone(DateTime.local().zoneName);
  return localTime.toFormat("HH:mm");
}

export const months = [
  "january",
  "february",
  "march",
  "april",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

export const days: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thurusday",
  "friday",
  "saturday",
];

export { convertEgyptTimeToLocalTime, convertLocalTimeToEgyptTime };

export const bDate = {
  getDate(value?: number | string | MeetDate) {
    return value ? new MeetDate(value) : new MeetDate();
  },
  getDay(
    {
      form = "english",
      date,
    }: {
      form?: "arabic" | "english" | "number";
      date?: number | string | MeetDate;
    } = { form: "english" }
  ) {
    const dayNum = this.getDate(date).getDay();
    if (form === "number") {
      return dayNum;
    }
    return form === "arabic" ? arabicWeekDays[dayNum] : days[dayNum];
  },
  getMonth(
    {
      form = "number",
      date,
    }: {
      form?: "arabic" | "english" | "number";
      date?: number | string | MeetDate;
    } = { form: "number" }
  ) {
    const num = this.getDate(date).getMonth();
    return form === "arabic"
      ? arabicMonths[num]
      : form === "english"
      ? months[num]
      : num + 1;
  },
  getDateDay(date?: number | string | MeetDate) {
    return this.getDate(date).getDate();
  },
  getTime(date?: number | string | MeetDate) {
    const tdate = this.getDate(date);
    return `${tdate.getHours() < 10 ? "0" : ""}${tdate.getHours()}:${
      tdate.getMinutes() < 10 ? "0" : ""
    }${tdate.getMinutes()}`;
  },
  getFormedDate(
    date?: number | string | MeetDate,
    {
      day = true,
      time = true,
      form = "english",
    }: { day?: boolean; time?: boolean; form: "arabic" | "english" } = {
      day: true,
      time: true,
      form: "english",
    }
  ) {
    const tdate = this.getDate(date);
    return (
      `${tdate.getFullYear()}/${this.getMonth()}/${tdate.getDate()} ${
        day ? this.getDay({ form }) : ""
      }` + (time ? " " + convertEgyptTimeToLocalTime(this.getTime()) : "")
    );
  },
};

export const sumStartAndDelay = (start: string, delay: string | number) => {
  return hrNumber(
    numHours(start) +
      (typeof delay === "string" ? numHours(delay) : secondsToHrs(delay))
  );
};
