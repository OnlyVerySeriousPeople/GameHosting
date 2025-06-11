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

export enum CustomCloseCode {
  MatchFinished = 4000,
  MatchCancelled = 4001,
}
