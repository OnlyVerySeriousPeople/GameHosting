import {Player} from './player';

export class Team extends Set<Player> {
  constructor(private readonly maxSize: number = 1) {
    super();
  }

  add(player: Player) {
    this.add(player);
    player.team = this;
    return this;
  }

  delete(player: Player): boolean {
    player.team = undefined;
    return this.delete(player);
  }

  isFull() {
    return this.size >= this.maxSize;
  }
}
