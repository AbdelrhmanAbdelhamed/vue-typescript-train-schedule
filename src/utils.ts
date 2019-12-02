import moment from "moment";

moment.locale("");

export const getDayOfWeek = (date: Date | string) => {
  let dayOfWeek = new Date(date).getDay();
  return isNaN(dayOfWeek)
    ? null
    : ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"][
        dayOfWeek
      ];
};

export const formatDayDate = (value: Date | string) => {
  if (value) {
    let date = moment(String(value)).format("YYYY/MM/DD");
    return `${getDayOfWeek(date)} ${date}`;
  }
};

export const formatTime = (value: Date | string) => {
  moment.locale("ar");
  if (value) {
    let date = moment(value, "HH:mm:ss").format("hh:mm A");
    return date;
  }
};

export const IsNumber = (value: string) => {
  return /\d/.test(value);
};

export function convertToArabic(value: any): any {
  const arabicNumbers = ["۰", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  let chars: any = String(value).split("");
  for (var i = 0; i < chars.length; i++) {
    if (/\d/.test(chars[i])) {
      chars[i] = arabicNumbers[chars[i]];
    }
  }
  return chars.join("");
}

export function observerClean(obj: any) {
  return Object.keys(obj).reduce(
    (res, e) => Object.assign(res, { [e]: obj[e] }),
    {}
  );
}

export function searchObj(obj: any, query: any): any {
  const values = Object.values(obj);
  for (let value of values) {
    if (typeof value === "object") {
      return searchObj(value, query);
    }
    if (typeof value === "string" || typeof value === "number") {
      const valueString: string = value.toString();
      if (valueString.toLowerCase().indexOf(query.toLowerCase()) > -1) {
        return obj;
      }
    }
  }
}

export const validationRules = {
  required: (value: any) => !!value,
  counter: (value: any) => value.length <= 20,
  email: (value: any) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value);
  }
};
