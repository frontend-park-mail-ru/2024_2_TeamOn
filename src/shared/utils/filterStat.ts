import { months } from "../consts/consts";

function filterStat(array: any, num: number) {
  return [
    array.valueX.filter((_: any, idx: number) => idx % num === 0),
    array.valueY.filter((_: any, idx: number) => idx % num === 0),
  ];
}

function filterStatDay(array: any) {
  return [
    array.valueX.filter((_: any, idx: number) => idx % 5 === 0),
    array.valueY.filter((_: any, idx: number) => idx % 5 === 0),
  ];
}
function customStatDay(array: any) {
  const s: any = new Set();
  const currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentDay = currentDate.getDate();

  return array.valueX.map((item: number) => {
    let newdate = item + ":00";
    if (item <= 23) {
      s.add("23");
    }
    if (s.has("23") && !s.has("next") && item !== 23) {
      currentDay = currentDay - 1;
      s.add("next");
    } else if (!s.has("curr")) {
      currentDay = currentDay + 1;
      s.add("curr");
    }
    return newdate + " " + currentDay + "." + (currentMonth + 1);
  });
}

function customStatMonth(array: any) {
  const s: any = new Set();
  const currentDate = new Date();
  let currentMonth = currentDate.getMonth();

  return array.valueX.map((item: number) => {
    if (item >= 31) {
      s.add("31");
    }
    if (s.has("31") && !s.has("next") && item !== 31) {
      currentMonth = currentMonth + 1;
      s.add("next");
    }
    return item + "." + currentMonth;
  });
}

function customStatYear(array: any) {
  return array.valueX.forEach((item: any, index: number) => {
    if (item == 1) {
      array.valueX[index] = months[item - 1];
    }
    if (item == 2) {
      array.valueX[index] = months[item - 1];
    }
    if (item == 3) {
      array.valueX[index] = months[item - 1];
    }
    if (item == 4) {
      array.valueX[index] = months[item - 1];
    }
    if (item == 5) {
      array.valueX[index] = months[item - 1];
    }
    if (item == 6) {
      array.valueX[index] = months[item - 1];
    }
    if (item == 7) {
      array.valueX[index] = months[item - 1];
    }
    if (item == 8) {
      array.valueX[index] = months[item - 1];
    }
    if (item == 9) {
      array.valueX[index] = months[item - 1];
    }
    if (item == 10) {
      array.valueX[index] = months[item - 1];
    }
    if (item == 11) {
      array.valueX[index] = months[item - 1];
    }
    if (item == 12) {
      array.valueX[index] = months[item - 1];
    }
  });
}
export {
  filterStat,
  customStatMonth,
  filterStatDay,
  customStatDay,
  customStatYear,
};
