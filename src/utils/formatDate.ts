import { getDate, getMonth, getYear, format } from "date-fns";

export function getWeekName(index: number) {
  switch (index) {
    case 0:
      return "Domingo";
    case 1:
      return "Segunda-feira";
    case 2:
      return "Terça-feira";
    case 3:
      return "Quarta-feira";
    case 4:
      return "Quinta-feira";
    case 5:
      return "Sexta-feira";
    case 6:
      return "Sábado";
    default:
      return "Segunda-feira";
  }
}

export function getFormattedMonthYearDate(date: Date) {
  return (
    String(getDate(date)).padStart(2, "0") + "/" + Number(getMonth(date) + 1)
  );
}
export function getWeek(index: number) {
  switch (index) {
    case 0:
      return "DOM";
    case 1:
      return "SEG";
    case 2:
      return "TER";
    case 3:
      return "QUA";
    case 4:
      return "QUI";
    case 5:
      return "SEX";
    case 6:
      return "SAB";
    default:
      return "SEG";
  }
}

export function formatMonthName(index: number) {
  switch (index) {
    case 0:
      return "Janeiro";
    case 1:
      return "Fevereiro";
    case 2:
      return "Março";
    case 3:
      return "Abril";
    case 4:
      return "Maio";
    case 5:
      return "Junho";
    case 6:
      return "Julho";
    case 7:
      return "Agosto";
    case 8:
      return "Setembro";
    case 9:
      return "Outubro";
    case 10:
      return "Novembro";
    case 11:
      return "Dezembro";
    default:
      return "Agosto";
  }
}

export function getFormatDate(date = new Date(), dateFormat = "dd/MM/yy") {
  return format(new Date(date), dateFormat);
}

export function getFormatHours(date = new Date()) {
  return format(new Date(date), "HH:mm");
}
