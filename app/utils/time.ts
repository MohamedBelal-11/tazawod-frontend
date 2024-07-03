export const numHours = (time: string) => {
  let rtime = time.slice(0, -3)
  return +rtime.slice(0, -3) + (+rtime.slice(-2) / 60)
}

export const hrNumber = (number: number) => {
  let mins = String(Math.round((number - Math.floor(number)) * 60));
  return (String(Math.floor(number)) + ":" + ( mins === "0" ? "00" : mins))
}