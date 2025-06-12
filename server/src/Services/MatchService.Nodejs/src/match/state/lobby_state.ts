import {MatchState, StateName} from './match_state';
import {ActiveState} from './active_state';
import {MsgInfoCode} from '@game-hosting/match-message-codes';
import {Player} from '../player';

export class LobbyState extends MatchState {
  name = StateName.Lobby;

  canPlayerJoin(): boolean {
    return true;
  }

  private informAboutCurPlayersNum(code: MsgInfoCode) {
    const {
      players: {size},
    } = this.match;

    this.match.players.forEach(p =>
      p.sendInfo(code, {
        currentNumberOfPlayers: size,
      }),
    );
  }

  onPlayerJoin(_player: Player): void {
    this.informAboutCurPlayersNum(MsgInfoCode.PlayerJoin);

    const {players, teams, config} = this.match;
    if (players.size < config.numberOfPlayers) return;

    const teamPlayerIds = [...teams.values()].map(team =>
      [...team].map(player => player.id),
    );

    players.forEach(p => {
      p.sendInfo(MsgInfoCode.MatchStart, {teams: teamPlayerIds});
    });

    this.match.state = new ActiveState(this.match);
  }

  onPlayerLeave(_player: Player): void {
    this.informAboutCurPlayersNum(MsgInfoCode.PlayerLeave);
  }

  isFinished(): boolean {
    return false;
  }
}
