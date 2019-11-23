export interface IStation {
  id?: string;
  name: string;
  createdAt?: Date;
  UpdatedAt?: Date;
  lines?: ILine[];
  line?: ILine;
  LineStation?: ILineStation;
}

export interface ILineStation {
  createdAt?: Date;
  UpdatedAt?: Date;
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
  UpdatedAt?: Date;
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
  UpdatedAt?: Date;
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
  UpdatedAt?: Date;
  train?: ITrain;
  rankId?: string;
  policeDepartmentId?: string;
  rank: IRank;
  trainRuns?: ITrainRun[];
  policeDepartment: IPoliceDepartment;
}

export interface IPoliceDepartment {
  id?: string;
  name: string;
  policePeople?: IPolicePerson[];
  createdAt?: Date;
  UpdatedAt?: Date;
}

export interface ITrainRun {
  id?: string;
  day: string;
  createdAt?: Date;
  UpdatedAt?: Date;
  train?: ITrain;
  trainId?: string;
  policePeople: IPolicePerson[];
}

export interface ITrain {
  id?: string;
  number: string;
  createdAt?: Date;
  UpdatedAt?: Date;
  line?: ILine;
  lineId?: string;
  trainRuns?: ITrainRun[];
}

export interface ITrainState {
  trains: ITrain[];
  newTrain: ITrain;
  currentTrain: ITrain;
  loading: boolean;
}

export interface IUser {
  id?: string;
  token?: string;
  username: string;
  password?: string;
  isAdmin?: boolean;
}

export interface IUserState {
  currentUser: IUser;
  users: IUser[];
  usernameErrorMessage: string | null;
  passwordErrorMessage: string | null;
}
