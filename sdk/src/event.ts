export enum EventType {
  LobbyJoin = 'LOBBY_JOIN',
  PlayerJoin = 'PLAYER_JOIN',
  PlayerLeave = 'PLAYER_LEAVE',
  MatchStart = 'MATCH_START',
  MatchFinish = 'MATCH_FINISH',
  MatchCancel = 'MATCH_CANCEL',
  UnexpectedClose = 'UNEXPECTED_CLOSE',
  NewInfo = 'NEW_INFO',
  NewData = 'NEW_DATA',
  NewError = 'NEW_ERROR',
  NewUnexpectedError = 'NEW_UNEXPECTED_ERROR',
}

export class EventManager {
  private readonly target = new EventTarget();

  on<T>(eventType: EventType, listener: (data: T) => void) {
    this.target.addEventListener(eventType, (event: Event) => {
      listener((event as CustomEvent<T>).detail);
    });
  }

  emit<T>(eventType: EventType, detail?: T) {
    this.target.dispatchEvent(new CustomEvent<T>(eventType, {detail}));
  }
}
