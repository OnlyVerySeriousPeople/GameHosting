import {Match} from './match';
import {MatchConfig} from './types';

type GameId = string;

const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

// TODO: replace witn an actual match config
const MATCH_CONFIG_STUB: MatchConfig = {
  numberOfPlayers: 4,
  numberOfTeams: 2,
};

class MatchSet extends Set<Match> {
  *[Symbol.iterator](): IterableIterator<Match> {
    for (const match of this.values()) {
      if (match.isFinished()) {
        this.delete(match);
      } else {
        yield match;
      }
    }
  }
}

export class MatchManager extends Map<GameId, MatchSet> {
  private readonly cleanupInterval: NodeJS.Timeout;

  constructor() {
    super();
    this.cleanupInterval = setInterval(
      () => this.performCleanup(),
      CLEANUP_INTERVAL_MS,
    );
  }

  getOrCreateMatch(gameId: GameId): Match {
    let gameMatches = this.get(gameId);
    if (!gameMatches) {
      gameMatches = new MatchSet();
      this.set(gameId, gameMatches);
    }

    for (const match of gameMatches) {
      if (match.canPlayerJoin()) return match;
    }

    const match = new Match(MATCH_CONFIG_STUB);
    gameMatches.add(match);
    return match;
  }

  private performCleanup(): void {
    for (const [gameId, matches] of this.entries()) {
      const cleanedMatches = new MatchSet();
      for (const match of matches) {
        cleanedMatches.add(match);
      }

      if (cleanedMatches.size > 0) {
        this.set(gameId, cleanedMatches);
      } else {
        this.delete(gameId);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.clear();
  }
}
