import {MatchState, StateName} from './match_state';

export class FinishedState extends MatchState {
  name = StateName.Finished;

  canPlayerJoin(): boolean {
    return false;
  }

  isFinished(): boolean {
    return true;
  }
}
