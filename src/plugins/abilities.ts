import Vue from "vue";
import AbilitiesModule from "../store/modules/Abilities";
import { abilitiesPlugin } from "@casl/vue";

Vue.use(abilitiesPlugin, AbilitiesModule.ability);
