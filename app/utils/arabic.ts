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

export const arabicMonths = [
  "يناير",
  "فبراير",
  "مارس",
  "إبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export const arabicWeekDays = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

export const arCase = (str: string) => {
  let returnedString = "";
  for (let char of str) {
    if (char === "أ" || char === "آ" || char === "إ") {
      returnedString += "ا";
    } else if (char === "ي") {
      returnedString += "ى";
    } else if (char === "ة") {
      returnedString += "ه";
    } else if (
      !(
        char === "ً" ||
        char === "َ" ||
        char === "ُ" ||
        char === "ِ" ||
        char === "ٍ" ||
        char === "ْ"
      )
    ) {
      returnedString += char;
    }
  }
  return returnedString;
};
