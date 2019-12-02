import { Ability, Rule } from "@casl/ability";

export interface IStation {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  lines?: ILine[];
  line?: ILine;
  LineStation?: ILineStation;
  lineStationId?: number;
  LineStationTrain?: LineStationTrain;
}

export interface LineStationTrain {
  arrivalTime?: string;
  departureTime?: string;
  isArrival: boolean;
  isDeprature: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILineStation {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lineId?: string;
  stationId?: string;
  stationOrder: number;
}

export interface IStationState {
  stations: IStation[];
  newStation: IStation;
  currentStation: IStation;
  loading: boolean;
}

export interface ILine {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  stations?: IStation[];
  trains?: ITrain[];
  LineStation?: ILineStation;
}

export interface ILineState {
  lines: ILine[];
  stations: IStation[];
  trains: ITrain[];
  newLine: ILine;
  currentLine: ILine;
  loading: boolean;
}

export interface IRank {
  id?: string;
  name: string;
  policePeople?: IPolicePerson[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPolicePersonState {
  policePeople: IPolicePerson[];
}

export interface IRankState {
  ranks: IRank[];
}

export interface IPoliceDepartmentState {
  policeDepartments: IPoliceDepartment[];
}

export interface IPolicePerson {
  id?: string;
  name: string;
  phoneNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
  train?: ITrain;
  rankId?: string;
  policeDepartmentId?: string;
  rank: IRank;
  trainRuns?: ITrainRun[];
  policeDepartment: IPoliceDepartment;
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

export interface IPoliceDepartment {
  id?: string;
  name: string;
  policePeople?: IPolicePerson[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITrainRun {
  id?: string;
  day: string;
  createdAt?: Date;
  updatedAt?: Date;
  train?: ITrain;
  trainId?: string;
  policePeople: IPolicePerson[];
}

export interface ITrain {
  id?: string;
  number: string;
  createdAt?: Date;
  updatedAt?: Date;
  lines?: ILine[];
  trainRuns?: ITrainRun[];
  stations?: IStation[];
}

export interface ITrainState {
  trains: ITrain[];
  newTrain: ITrain;
  currentTrain: ITrain;
  loading: boolean;
}

export interface IRole {
  id?: string;
  name: string;
  nameArabic: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRoleState {
  roles: IRole[];
  loading: boolean;
}

export interface IUser {
  id?: string;
  token?: string;
  fullName?: string;
  username: string;
  password?: string;
  role?: IRole;
  roleId?: string;
  trains?: ITrain[];
  policeDepartmentId?: string;
  policeDepartment?: IPoliceDepartment;
}

export interface IUserState {
  currentUser: IUser;
  users: IUser[];
  usernameErrorMessage: string | null;
  passwordErrorMessage: string | null;
}

export interface IAbilityState {
  ability: Ability;
  rules: Rule[];
}
