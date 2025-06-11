import * as state from './match_state';
import {DataReceiver, MatchConfig, MessageErrorCode} from './types';
import {Player} from './player';
import {Team} from './team';
import {WebSocket} from '@fastify/websocket';

type PlayerId = string;

export class Match {
  private state: state.MatchState = new state.LobbyState(this);
  players: Map<PlayerId, Player> = new Map();
  teams: Set<Team> = new Set();

  constructor(readonly config: MatchConfig) {
    while (this.teams.size < config.numberOfTeams) {
      this.teams.add(new Team(config.numberOfPlayers / config.numberOfTeams));
    }
  }

  setState(state: state.MatchState) {
    this.state = state;
  }

  canPlayerJoin() {
    return this.state.canPlayerJoin();
  }

  addPlayer(id: PlayerId, socket: WebSocket) {
    const player = new Player(id, socket);
    this.players.set(id, player);
    for (const team of this.teams) {
      if (!team.isFull()) team.add(player);
    }

    this.state.onPlayerJoin(player);
  }

  removePlayer(id: PlayerId) {
    const player = this.players.get(id);
    if (player) {
      player.team?.delete(player);
      this.players.delete(id);

      this.state.onPlayerLeave(player);
    }
  }

  isFinished() {
    return this.state.isFinished();
  }

  handleMessage(senderId: PlayerId, message: string) {
    const sender = this.players.get(senderId);
    if (!sender) return;

    let parsedMessage: {
      receiver: DataReceiver;
      data: unknown;
      isFinish?: true;
    };
    try {
      parsedMessage = JSON.parse(message);
    } catch (err) {
      sender.sendError(MessageErrorCode.BadMessage);
      return;
    }

    const {isFinish, receiver, data} = parsedMessage;

    const broadcastExceptSender = (player: Player) => {
      if (player !== sender) player.sendData(senderId, data);
    };

    if (isFinish) {
      if (data)
        this.players.forEach(p => {
          broadcastExceptSender(p);
          p.disconnect('match-finished');
        });
      this.setState(new state.FinishedState(this));
      return;
    }

    if (!data) {
      sender.sendError(MessageErrorCode.NoDataProvided);
      return;
    }

    if (receiver === DataReceiver.All) {
      this.players.forEach(broadcastExceptSender);
    } else if (receiver === DataReceiver.Team) {
      sender.team?.forEach(broadcastExceptSender);
    } else {
      sender.sendError(MessageErrorCode.BadDataReceiver);
    }
  }
}
