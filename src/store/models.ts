import { Ability, Rule } from "@casl/ability";

export class Station {
  id?: string;
  name!: string;
  createdAt?: Date;
  updatedAt?: Date;
  lines?: Line[];
  line?: Line;
  LineStation?: LineStation;
  lineStationId?: number;
  LineStationTrain?: LineStationTrain;
}

export class LineStationTrain {
  arrivalTime?: string;
  departureTime?: string;
  isArrival!: boolean;
  isDeprature!: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class LineStation {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lineId?: string;
  stationId?: string;
  stationOrder!: number;
}

export class StationState {
  stations!: Station[];
  newStation!: Station;
  currentStation!: Station;
  loading!: boolean;
}

export class Line {
  id?: string;
  name!: string;
  createdAt?: Date;
  updatedAt?: Date;
  stations?: Station[];
  trains?: Train[];
  LineStation?: LineStation;
  hide?: boolean;
}

export class LineState {
  lines!: Line[];
  stations!: Station[];
  trains!: Train[];
  newLine!: Line;
  currentLine!: Line;
  loading!: boolean;
}

export class Rank {
  id?: string;
  name!: string;
  policePeople?: PolicePerson[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class PolicePersonState {
  policePeople!: PolicePerson[];
}

export class RankState {
  ranks!: Rank[];
}

export class PoliceDepartmentState {
  policeDepartments!: PoliceDepartment[];
}

export class PolicePerson {
  id?: string;
  name!: string;
  phoneNumber!: string;
  createdAt?: Date;
  updatedAt?: Date;
  train?: Train;
  rankId?: string;
  policeDepartmentId?: string;
  rank!: Rank;
  trainRuns?: TrainRun[];
  policeDepartment!: PoliceDepartment;
  fromStationId?: string;
  toStationId?: string;
  TrainRunPolicePerson?: {
    fromStation?: {
      name?: string;
      id?: string;
    };
    toStation?: {
      name?: string;
      id?: string;
    };
  };
}

export class PoliceDepartment {
  id?: string;
  name!: string;
  policePeople?: PolicePerson[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class TrainRun {
  id?: string;
  day!: string;
  createdAt?: Date;
  updatedAt?: Date;
  train?: Train;
  trainId?: string;
  policePeople!: PolicePerson[];
}

export class TrainRunRevision extends TrainRun {
  revisionId!: string;
  revisionValidFrom!: Date;
  revisionValidTo!: Date;
  whoDunnit!: string;
}

export class Train {
  id?: string;
  number!: string;
  createdAt?: Date;
  updatedAt?: Date;
  lines?: Line[];
  trainRuns?: TrainRun[];
  trainRunsRevisions?: TrainRunRevision[];
  stations?: Station[];
  users?: User[];
  line?: Line;
  lineName?: string;

  constructor({
    id,
    number,
    createdAt,
    updatedAt,
    lines,
    trainRuns,
    stations,
    users,
    line,
    lineName
  }: {
    id?: string;
    number: string;
    createdAt?: Date;
    updatedAt?: Date;
    lines?: Line[];
    trainRuns?: TrainRun[];
    stations?: Station[];
    users?: User[];
    line?: Line;
    lineName?: string;
  }) {
    this.id = id;
    (this.number = number), (this.createdAt = createdAt);
    this.updatedAt = updatedAt;
    this.lines = lines;
    this.trainRuns = trainRuns;
    this.stations = stations;
    this.users = users;
    this.line = line;
    this.lineName = lineName;
  }
}

export class TrainState {
  trains!: Train[];
  newTrain!: Train;
  currentTrain!: Train;
  loading!: boolean;
  trainRuns!: TrainRun[];
  trainRunsRevisions!: TrainRunRevision[];
}

export class Role {
  id?: string;
  name!: string;
  nameArabic!: string;
  description!: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class RoleState {
  roles!: Role[];
  loading!: boolean;
}

export class User {
  id?: string;
  token?: string;
  fullName?: string;
  username!: string;
  password?: string;
  role?: Role;
  roleId?: string;
  trains?: Train[];
  policeDepartmentId?: string;
  policeDepartment?: PoliceDepartment;
}

export class UserState {
  currentUser!: User;
  users!: User[];
  usernameErrorMessage!: string | null;
  passwordErrorMessage!: string | null;
}

export class AbilityState {
  ability!: Ability;
  rules!: Rule[];
}
