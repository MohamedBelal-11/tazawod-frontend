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
