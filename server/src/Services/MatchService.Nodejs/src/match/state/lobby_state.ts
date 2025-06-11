import {MatchState, StateName} from './match_state';
import {ActiveState} from './active_state';
import {MsgInfoCode} from '../types';
import {Player} from '../player';

export class LobbyState extends MatchState {
  name = StateName.Lobby;

  canPlayerJoin(): boolean {
    return true;
  }

  private informAboutCurPlayersNum(code: MsgInfoCode) {
    const {players} = this.match;
    players.forEach(p =>
      p.sendInfo(code, {
        currentNumberOfPlayers: players.size,
      }),
    );
  }

  onPlayerJoin(_player: Player): void {
    this.informAboutCurPlayersNum(MsgInfoCode.PlayerJoin);

    const {players, config} = this.match;
    if (players.size === config.numberOfPlayers) {
      players.forEach(p => {
        const yourTeam = [];
        const otherTeams = [];
        for (const team of this.match.teams) {
          if (team !== p.team) {
            const teamPlayers = [];
            for (const player of team) {
              teamPlayers.push(player);
            }
            otherTeams.push(teamPlayers);
          } else {
            for (const player of team) {
              if (player !== p) {
                yourTeam.push(player);
              }
            }
          }
        }

        p.sendInfo(MsgInfoCode.MatchStart, {yourTeam, otherTeams});
      });
      this.match.setState(new ActiveState(this.match));
    }
  }

  onPlayerLeave(_player: Player): void {
    this.informAboutCurPlayersNum(MsgInfoCode.PlayerLeave);
  }

  isFinished(): boolean {
    return false;
  }
}
