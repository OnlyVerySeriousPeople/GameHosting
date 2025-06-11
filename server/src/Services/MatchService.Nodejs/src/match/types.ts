export interface MatchConfig {
  numberOfPlayers: number;
  numberOfTeams: number;
}

export enum MessageInfoCode {
  CheckMessage,
  PlayerJoin,
  PlayerLeave,
  MatchStart,
}

export enum MessageErrorCode {
  BadMessage,
  NoDataProvided,
  BadDataReceiver,
}

export enum DataReceiver {
  All,
  Team,
}

export enum ConnectionCloseCode {
  NormalClosure = 1000,
  MatchFinished = 4000,
  MatchCancelled = 4001,
}
