export interface MatchConfig {
  numberOfPlayers: number;
  numberOfTeams: number;
}

export enum MsgInfoCode {
  CheckMessage,
  PlayerJoin,
  PlayerLeave,
  MatchStart,
}

export enum MsgErrCode {
  BadMessage,
  NoDataProvided,
  BadDataReceiver,
}

export enum DataReceiver {
  All,
  Team,
}

export enum ConnCloseCode {
  NormalClosure = 1000,
  MatchFinished = 4000,
  MatchCancelled = 4001,
}
