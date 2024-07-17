export const sum = (numbers: number[]) => {
  let num = 0;
  for (let numb of numbers) {
    num += numb;
  }
  return num;
};
