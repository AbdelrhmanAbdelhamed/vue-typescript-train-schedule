import Vue from "vue";

import {
  formatDayDate,
  formatTime,
  convertToArabic,
  convertToEnglish,
  timeFromNow,
  formatDate
} from "@/utils";

Vue.filter("formatDayDate", (value: Date | string) => {
  if (value) {
    return formatDayDate(value);
  }
});

Vue.filter("formatDate", (value: Date | string) => {
  if (value) {
    return formatDate(value);
  }
});

Vue.filter("formatTime", (value: Date | string) => {
  if (value) {
    return formatTime(value);
  }
});

Vue.filter("convertToArabic", (value: any) => {
  return convertToArabic(value);
});

Vue.filter("convertToEnglish", (value: any) => {
  return convertToEnglish(value);
});

Vue.filter("timeFromNow", (value: Date, withOutSuffix: boolean = false) => {
  return timeFromNow(value, withOutSuffix);
});
