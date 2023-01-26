export function timeToSecondFormater(time: string) {
  if (time.includes(":")) {
    const [min, sec] = time.split(":");
    return Number(min) * 60 + Number(sec);
  }
}

export function secondToTimeFormater(sec: number | string) {
  const min = Math.floor((Number(sec) % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(Number(sec) % 60)
    .toString()
    .padStart(2, "0");

  return min + ":" + seconds;
}
