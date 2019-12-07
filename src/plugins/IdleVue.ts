import Vue from "vue";
import store from "@/store";
import IdleVue from "idle-vue";

Vue.use(IdleVue, {
  store,
  idleTime: 10 * 60 * 1000, // 10 minutes in milliseconds
  events: ["mousemove", "keydown", "mousedown", "touchstart", "scroll"],
  keepTracking: true,
  startAtIdle: false
});
