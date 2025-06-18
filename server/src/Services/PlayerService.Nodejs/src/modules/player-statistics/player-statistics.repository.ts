import { Injectable } from '@nestjs/common';
import { Prisma, PlayerStatistics } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class PlayerStatisticsRepository {
  constructor(private readonly database: DatabaseService) {}

  async findByPlayerId(playerId: number): Promise<PlayerStatistics | null> {
    return this.database.playerStatistics.findUnique({
      where: { playerId },
    });
  }

  async updateStat(
    playerId: number,
    stat: keyof PlayerStatistics,
    value: number,
  ): Promise<void> {
    await this.database.playerStatistics.update({
      where: { playerId },
      data: { [stat]: value },
    });
  }

  async create(playerId: number, tx?: Prisma.TransactionClient) {
    const db = tx ?? this.database;
    return db.playerStatistics.create({
      data: {
        player: {
          connect: { id: playerId },
        },
      },
    });
  }
}
