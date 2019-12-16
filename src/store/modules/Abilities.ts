import { Ability, Rule } from "@casl/ability";
import { unpackRules } from "@casl/ability/extra";
import jwtDecode from "jwt-decode";
import {
  getModule,
  Module,
  Mutation,
  Action,
  VuexModule
} from "vuex-module-decorators";

import store from "..";
import { AbilityState } from "../models";

@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: "abilities"
})
class AbilitiesModule extends VuexModule implements AbilityState {
  ability: Ability = new Ability([]);
  rules: Rule[] = [];

  @Mutation
  setAbility(ability: Ability) {
    this.ability = ability;
  }

  @Mutation
  setRules(rules: any) {
    this.rules = rules;
  }

  @Mutation
  resetRules() {
    this.rules = [];
  }

  @Action
  getRulesFromToken(token: any) {
    const { rules } = jwtDecode(token);
    this.setRules(unpackRules(rules));
  }

  @Action
  updateAbility() {
    this.setAbility(this.ability.update(this.rules));
  }
}

export default getModule(AbilitiesModule);
