import {Match} from '../match';
import {Player} from '../player';

export enum StateName {
  Lobby = 'LOBBY',
  InProgress = 'IN_PROGRESS',
  Finished = 'FINISHED',
  Cancelled = 'CANCELLED',
}

export abstract class MatchState {
  abstract name: StateName;

  constructor(protected match: Match) {}

  canPlayerJoin(): boolean {
    return false;
  }

  onPlayerJoin(_player: Player): void {}

  onPlayerLeave(_player: Player): void {}

  isFinished(): boolean {
    return true;
  }
}
