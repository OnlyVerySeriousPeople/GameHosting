import {MatchState, StateName} from './match_state';

export class CancelledState extends MatchState {
  name = StateName.Cancelled;

  canPlayerJoin(): boolean {
    return false;
  }

  isFinished(): boolean {
    return true;
  }
}
