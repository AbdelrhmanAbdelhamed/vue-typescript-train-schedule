import Vue from "vue";
import Vuetify from "vuetify/lib";
import ar from "vuetify/src/locale/ar";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: "#795548",
        secondary: "#e91e63",
        accent: "#9c27b0",
        error: "#d50000",
        warning: "#ffc107",
        info: "#607d8b",
        success: "#4caf50"
      }
    }
  },
  lang: {
    locales: { ar },
    current: "ar"
  },
  rtl: true
});
