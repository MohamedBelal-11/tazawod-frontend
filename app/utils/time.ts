export const numHours = (time: string) => {
  let rtime = time.slice(0, -3)
  return +rtime.slice(0, -3) + (+rtime.slice(-2) / 60)
}