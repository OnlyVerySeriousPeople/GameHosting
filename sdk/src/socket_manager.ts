import {
  CustomCloseCode,
  MsgErrCode,
  MsgInfoCode,
} from '@game-hosting/match-message-codes';
import {EventManager, EventType} from './event.js';
import {GameMessage} from './types.js';

export class SocketManager {
  private readonly socket: WebSocket;

  constructor(
    url: string,
    private readonly gameId: string,
    private readonly playerId: string,
    private readonly events: EventManager,
  ) {
    this.socket = new WebSocket(`${url}?gameId=${gameId}&playerId=${playerId}`);
    this.setupHandlers();
  }

  private setupHandlers() {
    this.socket.addEventListener('open', () => {
      this.events.emit(EventType.LobbyJoin);
    });

    this.socket.addEventListener('message', event => {
      let message;
      try {
        message = JSON.parse(event.data);
      } catch {
        this.events.emit(EventType.NewUnexpectedError);
        return;
      }

      this.handleMessage(message);
    });

    this.socket.addEventListener('error', () => {
      this.events.emit(EventType.NewUnexpectedError);
    });

    this.socket.addEventListener('close', ({code, reason}) => {
      if (code === CustomCloseCode.MatchFinished) {
        this.events.emit(EventType.MatchFinish);
      } else if (code === CustomCloseCode.MatchCancelled) {
        this.events.emit(EventType.MatchCancel);
      } else {
        this.events.emit(EventType.UnexpectedClose, reason);
      }
    });
  }

  private handleMessage(message: GameMessage) {
    switch (message.type) {
      case 'info':
        // eslint-disable-next-line no-case-declarations
        const handler = {
          [MsgInfoCode.PlayerJoin]: () =>
            this.events.emit(EventType.PlayerJoin, {
              currentNumberOfPlayers:
                message.details?.currentNumberOfPlayers || 1,
            }),
          [MsgInfoCode.PlayerLeave]: () =>
            this.events.emit(EventType.PlayerLeave, {
              currentNumberOfPlayers:
                message.details?.currentNumberOfPlayers || 1,
            }),
          [MsgInfoCode.MatchStart]: () =>
            this.events.emit(EventType.MatchStart, {
              teams: message.details?.teams || [],
            }),
        }[message.code];

        if (handler) handler();
        else this.events.emit(EventType.NewInfo, {message: message.message});

        break;
      case 'data':
        if (message.sender !== this.playerId) {
          this.events.emit(EventType.NewData, {
            sender: message.sender,
            data: message.data,
          });
        }
        break;
      case 'error':
        if (
          [
            MsgErrCode.BadMessage,
            MsgErrCode.NoDataProvided,
            MsgErrCode.BadDataReceiver,
          ].includes(message.code)
        ) {
          this.events.emit(EventType.NewError, {
            message: 'invalid message received',
          });
        } else {
          this.events.emit(EventType.NewUnexpectedError);
        }
        break;
      default:
        this.events.emit(EventType.NewUnexpectedError);
    }
  }
}
