export class UpdatePlayerStatisticDto {
  playerId: number;
  statTarget: string;
  operation: 'increment' | 'decrement';
  value: number;
}
