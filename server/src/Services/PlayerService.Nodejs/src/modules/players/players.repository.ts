import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Prisma } from '@prisma/client';
import { IdOrUsername } from './interfaces/id-or-username.inteface';

@Injectable()
export class PlayersRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(data: Prisma.PlayerCreateInput) {
    return this.database.player.create({ data });
  }

  async findUnique(input: IdOrUsername) {
    return this.database.player.findUnique({
      where: input.id ? { id: input.id } : { username: input.username },
    });
  }

  async findAll() {
    return this.database.player.findMany();
  }

  async update(id: number, data: Prisma.PlayerUpdateInput) {
    return this.database.player.update({
      where: { id },
      data,
    });
  }

  async delete(input: IdOrUsername) {
    return this.database.player.delete({
      where: input.id ? { id: input.id } : { username: input.username },
    });
  }

  async withTransaction<T>(callback: (db: typeof this.database) => Promise<T>) {
    return this.database.$transaction(callback);
  }
}
