import {EventManager, EventType} from './event.js';
import {SocketManager} from './socket_manager.js';

// TODO: replace with an actual service URL
const SERVICE_URL = 'ws://localhost:8082';

type Listener<T = undefined> = (data: T) => void;

export class GameHosting {
  readonly client: {id: string};
  private readonly events: EventManager;
  private readonly socketManager: SocketManager;

  private constructor(
    private readonly gameId: string,
    private readonly playerId: string,
  ) {
    this.client = {id: playerId};
    this.events = new EventManager();
    this.socketManager = new SocketManager(
      SERVICE_URL,
      gameId,
      playerId,
      this.events,
    );
  }

  static async join(gameName: string) {
    return new GameHosting(
      await this.fetchGameId(gameName),
      await this.fetchPlayerId(),
    );
  }

  private static async fetchGameId(_gameName: string) {
    // TODO: replace with real `fetch` call
    return 'testGameId';
  }

  private static async fetchPlayerId() {
    // TODO: replace with real `fetch` call
    return 'testPlayerId';
  }

  onLobbyJoin(listener: Listener) {
    this.events.on(EventType.LobbyJoin, listener);
  }

  onPlayerJoin(listener: Listener<{currentNumberOfPlayers: number}>) {
    this.events.on(EventType.PlayerJoin, listener);
  }

  onPlayerLeave(listener: Listener<{currentNumberOfPlayers: number}>) {
    this.events.on(EventType.PlayerLeave, listener);
  }

  onMatchStart(listener: Listener<{teams: string[][]}>) {
    this.events.on(EventType.MatchStart, listener);
  }

  onNewInfo(listener: Listener<{message: string}>) {
    this.events.on(EventType.NewInfo, listener);
  }

  onNewData(listener: Listener<{sender: string; data: unknown}>) {
    this.events.on(EventType.NewData, listener);
  }

  onNewError(listener: Listener<{message: string}>) {
    this.events.on(EventType.NewError, listener);
  }

  onNewUnexpectedError(listener: Listener) {
    this.events.on(EventType.NewUnexpectedError, listener);
  }

  onMatchFinish(listener: Listener) {
    this.events.on(EventType.MatchFinish, listener);
  }

  onMatchCancel(listener: Listener) {
    this.events.on(EventType.MatchCancel, listener);
  }

  onUnexpectedClose(listener: Listener) {
    this.events.on(EventType.UnexpectedClose, listener);
  }
}
