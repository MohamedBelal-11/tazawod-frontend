export const numHours = (time: string) => {
  let [hours, minutes, secondes] = time.split(":").map(Number);
  return hours + minutes / 60 + secondes / 60 / 60;
};

export const hrNumber = (number: number) => {
  let mins = String(Math.round((number - Math.floor(number)) * 60));
  let hrs = String(Math.floor(number));
  return (
    (hrs.length === 1 ? "0" + hrs : hrs) + ":" + (mins === "0" ? "00" : mins)
  );
};

import { DateTime } from "luxon";
import { Weekday } from "./students";
import { arabicMonths, arabicWeekDays } from "./arabic";

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
  getDate(value?: number | string | Date) {
    return value ? new Date(value) : new Date();
  },
  getDay(
    {
      form = "english",
      date,
    }: {
      form?: "arabic" | "english" | "number";
      date?: number | string | Date;
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
      form = "english",
      date,
    }: {
      form?: "arabic" | "english" | "number";
      date?: number | string | Date;
    } = { form: "number" }
  ) {
    const num = this.getDate(date).getMonth();
    return form === "arabic"
      ? arabicMonths[num]
      : form === "english"
      ? months[num]
      : num + 1;
  },
  getDateDay(date?: number | string | Date) {
    return this.getDate(date).getDate();
  },
  getTime(date?: number | string | Date) {
    const tdate = this.getDate(date);
    return `${tdate.getHours() < 10 ? "0" : ""}${tdate.getHours()}:${
      tdate.getMinutes() < 10 ? "0" : ""
    }${tdate.getMinutes()}`;
  },
  getFormedDate(
    date?: number | string | Date,
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
