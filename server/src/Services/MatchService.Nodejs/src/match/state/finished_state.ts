import {MatchState, StateName} from './match_state';
import {CustomCloseCode} from '@game-hosting/match-message-codes';
import {Match} from '../match';

export class FinishedState extends MatchState {
  name = StateName.Finished;

  constructor(match: Match) {
    super(match);

    this.match.players.forEach(p =>
      p.disconnect(CustomCloseCode.MatchFinished),
    );
    this.match.clear();
  }

  canPlayerJoin(): boolean {
    return false;
  }

  isFinished(): boolean {
    return true;
  }
}
