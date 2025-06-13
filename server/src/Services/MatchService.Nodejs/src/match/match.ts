import {DataReceiver, MsgErrCode} from '@game-hosting/match-message-codes';
import {FinishedState, LobbyState, MatchState} from './state';
import {MatchConfig} from './config';
import {Player} from './player';
import {Team} from './team';
import {WebSocket} from '@fastify/websocket';

type PlayerId = string;

export class Match {
  state: MatchState = new LobbyState(this);
  players: Map<PlayerId, Player> = new Map();
  teams: Set<Team> = new Set();

  constructor(readonly config: MatchConfig) {
    while (this.teams.size < config.numberOfTeams) {
      const teamSize = config.numberOfPlayers / config.numberOfTeams;
      this.teams.add(new Team(teamSize));
    }
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
    if (!player) return;

    player.team?.delete(player);
    this.players.delete(id);

    this.state.onPlayerLeave(player);
  }

  isFinished() {
    return this.state.isFinished();
  }

  handleMessage(senderId: PlayerId, message: string) {
    const sender = this.players.get(senderId);
    if (!sender) return;

    let parsed: {receiver: DataReceiver; data: unknown; isFinish?: true};
    try {
      parsed = JSON.parse(message);
    } catch {
      sender.sendError(MsgErrCode.BadMessage);
      return;
    }

    const {isFinish, data, receiver} = parsed;
    const sendData = (player: Player) => player.sendData(senderId, data);

    if (isFinish) {
      if (data) this.players.forEach(sendData);
      this.state = new FinishedState(this);
      return;
    }

    if (!data) {
      sender.sendError(MsgErrCode.NoDataProvided);
      return;
    }

    if (receiver === DataReceiver.All) {
      this.players.forEach(sendData);
    } else if (receiver === DataReceiver.Team) {
      sender.team?.forEach(sendData);
    } else {
      sender.sendError(MsgErrCode.BadDataReceiver);
    }
  }

  clear() {
    this.players.clear();
    this.teams.clear();
  }
}
