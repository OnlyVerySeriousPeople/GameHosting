import {MatchState, StateName} from './match_state';
import {CancelledState} from './canceled_state';
import {Player} from '../player';

export class ActiveState extends MatchState {
  name = StateName.InProgress;

  canPlayerJoin(): boolean {
    return false;
  }

  onPlayerLeave(_player: Player): void {
    this.match.players.forEach(p => {
      p.disconnect('match-canceled');
    });
    this.match.setState(new CancelledState(this.match));
  }

  isFinished(): boolean {
    return false;
  }
}
