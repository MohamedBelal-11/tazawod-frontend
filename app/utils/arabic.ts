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