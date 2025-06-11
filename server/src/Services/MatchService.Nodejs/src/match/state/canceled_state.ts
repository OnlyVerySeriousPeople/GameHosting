import {MatchState, StateName} from './match_state';
import {ConnCloseCode} from '../types';
import {Match} from '../match';

export class CancelledState extends MatchState {
  name = StateName.Cancelled;

  constructor(match: Match) {
    super(match);

    this.match.players.forEach(p => p.disconnect(ConnCloseCode.MatchCancelled));
    this.match.clear();
  }

  canPlayerJoin(): boolean {
    return false;
  }

  isFinished(): boolean {
    return true;
  }
}
