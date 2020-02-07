import { Ability, Rule } from "@casl/ability";

export class Station {
  static get modelName() {
    return "Station";
  }
  id?: string;
  name!: string;
  createdAt?: Date;
  updatedAt?: Date;
  lines?: Line[];
  line?: Line;
  lineName?: string;
  LineStation?: LineStation;
  lineStationId?: string;
  LineTrainStation?: LineTrainStation;
  constructor({
    id,
    name,
    createdAt,
    updatedAt,
    lines,
    line,
    lineName,
    LineStation,
    lineStationId,
    LineTrainStation
  }: {
    id?: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    lines?: Line[];
    line?: Line;
    lineName?: string;
    LineStation?: LineStation;
    lineStationId?: string;
    LineTrainStation?: LineTrainStation;
  }) {
    this.id = id;
    (this.name = name), (this.createdAt = createdAt);
    this.updatedAt = updatedAt;
    this.lines = lines;
    this.line = line;
    this.lineName = lineName;
    this.LineStation = LineStation;
    this.lineStationId = lineStationId;
    this.LineTrainStation = LineTrainStation;
  }
}

export class LineTrainStation {
  static get modelName() {
    return "LineTrainStation";
  }
  arrivalTime?: string;
  departureTime?: string;
  isArrival!: boolean;
  isDeprature!: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class LineStation {
  static get modelName() {
    return "LineStation";
  }
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
  static get modelName() {
    return "Line";
  }
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
  static get modelName() {
    return "Rank";
  }
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
  static get modelName() {
    return "PolicePerson";
  }
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
  static get modelName() {
    return "PoliceDepartment";
  }
  id?: string;
  name!: string;
  policePeople?: PolicePerson[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class TrainRun {
  static get modelName() {
    return "TrainRun";
  }
  id?: string;
  day!: string;
  createdAt?: Date;
  updatedAt?: Date;
  train?: Train;
  trainId?: string;
  policePeople!: PolicePerson[];
  userId!: string;

  constructor({
    id,
    day,
    createdAt,
    updatedAt,
    train,
    trainId,
    policePeople,
    userId
  }: {
    id?: string;
    day: string;
    createdAt?: Date;
    updatedAt?: Date;
    train?: Train;
    trainId?: string;
    policePeople: PolicePerson[];
    userId: string;
  }) {
    this.id = id;
    this.day = day;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.train = train;
    this.trainId = trainId;
    this.policePeople = policePeople;
    this.userId = userId;
  }
}

export class TrainRunRevision extends TrainRun {
  static get modelName() {
    return "TrainRunRevision";
  }
  revisionId!: string;
  revisionValidFrom!: Date;
  revisionValidTo!: Date;
  whoDunnit!: string;
}

export class Train {
  static get modelName() {
    return "Train";
  }

  item?: Train;
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
  departureStation?: Station;
  arrivalStation?: Station;
  crossedNextDay?: boolean;

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
    lineName,
    departureStation,
    arrivalStation,
    crossedNextDay
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
    departureStation?: Station;
    arrivalStation?: Station;
    crossedNextDay?: boolean;
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
    this.departureStation = departureStation;
    this.arrivalStation = arrivalStation;
    this.crossedNextDay = crossedNextDay;
  }
}

export class TrainState {
  trains!: Train[];
  newTrain!: Train;
  currentTrain!: Train;
  loading!: boolean;
  trainRuns!: TrainRun[];
  trainRunsRevisions!: TrainRunRevision[];
  departureStation?: string;
  arrivalStation?: string;
  showTable?: boolean;
}

export class Role {
  static get modelName() {
    return "Role";
  }
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
  static get modelName() {
    return "User";
  }
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
