import Vue from "vue";

import { formatDayDate, formatTime, convertToArabic } from "@/utils";

Vue.filter("formatDayDate", (value: Date | string) => {
  if (value) {
    return formatDayDate(value);
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
