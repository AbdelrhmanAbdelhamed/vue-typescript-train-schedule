import Vue from "vue";

import { formatDayDate, convertToArabic } from "@/utils";

Vue.filter("formatDayDate", (value: Date | string) => {
  if (value) {
    return formatDayDate(value);
  }
});

Vue.filter("convertToArabic", (value: any) => {
  return convertToArabic(value);
});
