export const LCcharsList: string[] = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];
export const UCcharsList: string[] = [
  ...LCcharsList.map((char) => char.toUpperCase()),
];

export const charsList: string[] = [...LCcharsList, ...UCcharsList];

export const almightyTrim = (str: string) => {
  let rstr = str.trim();
  while (rstr.includes("  ")) {
    rstr =
      rstr.slice(0, rstr.indexOf("  ")) + rstr.slice(rstr.indexOf("  ") + 1);
  }
  return rstr;
};

let list = [];

for (let i = 0; i < 10; i++) {
  list.push(String(i));
}

export const numList: string[] = list;

export const arCharsList = [
  'ض',
  'ص',
  'ث',
  'ق',
  'ف',
  'غ',
  'إ',
  'ع',
  'ه',
  'خ',
  'ح',
  'ج',
  'د',
  'ش',
  'س',
  'ي',
  'ب',
  'ل',
  'ا',
  'أ',
  'ت',
  'ن',
  'م',
  'ك',
  'ط',
  'ئ',
  'ء',
  'ؤ',
  'ر',
  'ى',
  'آ',
  'ة',
  'و',
  'ز',
  'ظ',
];
