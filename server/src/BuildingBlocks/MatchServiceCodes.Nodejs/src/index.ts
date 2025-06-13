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

export enum CloseCode {
  NormalClosure = 1000,
  UnsupportedData = 1003,
}

export enum CustomCloseCode {
  MatchFinished = 4000,
  MatchCancelled = 4001,
}
