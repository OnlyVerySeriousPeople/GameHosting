import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Achievement } from '@prisma/client';

@Injectable()
export class AchievementsRepository {
  constructor(private readonly database: DatabaseService) {}

  async findById(id: number): Promise<Achievement | null> {
    return this.database.achievement.findUnique({ where: { id } });
  }

  async findByTitle(title: string): Promise<Achievement | null> {
    return this.database.achievement.findUnique({ where: { title } });
  }

  async findAll(): Promise<Achievement[]> {
    return this.database.achievement.findMany();
  }
}
