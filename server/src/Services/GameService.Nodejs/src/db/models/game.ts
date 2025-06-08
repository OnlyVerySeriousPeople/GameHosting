import {DB, Game, GameCategory} from '../../gen_kysely';
import {
  ExpressionOrFactory,
  Insertable,
  Kysely,
  Selectable,
  SqlBool,
  Updateable,
  sql,
} from 'kysely';
import {DatabaseError} from '@game-hosting/common/errors';
import {HandleError} from '@game-hosting/common/db_model_utils';

export type GameSchema = Selectable<Game>;

export type GameFilter = ExpressionOrFactory<DB, 'game', SqlBool>;

export class GameModel {
  constructor(private readonly db: Kysely<DB>) {}

  static validCategories(categories: string[]) {
    const validValues = Object.values(GameCategory) as string[];
    const invalidValue = categories.find(ctg => !validValues.includes(ctg));
    if (invalidValue) {
      throw new DatabaseError(`invalid game category: ${invalidValue}`);
    }

    return categories as GameCategory[];
  }

  @HandleError
  async createGame(data: Insertable<Game>) {
    await this.db.insertInto('game').values(data).execute();
  }

  @HandleError
  async updateGame(gameId: string, data: Updateable<Game>) {
    await this.db
      .updateTable('game')
      .set(data)
      .where('id', '=', gameId)
      .execute();
  }

  @HandleError
  async incGamePlaysCt(gameId: string) {
    await this.db
      .updateTable('game')
      .set(eb => ({
        totalPlaysCount: eb('totalPlaysCount', '+', 1),
      }))
      .where('id', '=', gameId)
      .execute();
  }

  @HandleError
  async deleteGame(gameId: string) {
    await this.db.deleteFrom('game').where('id', '=', gameId).execute();
  }

  @HandleError
  async getGameCategories(onlyUsed: boolean) {
    if (!onlyUsed) return Object.values(GameCategory);

    const result = await this.db
      .selectFrom(
        this.db
          .selectFrom('game')
          .select(sql`unnest(categories)`.as('category'))
          .where('categories', 'is not', null)
          .as('unnested'),
      )
      .select('category')
      .distinct()
      .execute();

    return result.map(row => row.category as GameCategory);
  }

  @HandleError
  async getGames(
    filter: GameFilter,
    offset: number,
    limit: number,
  ): Promise<GameSchema[]> {
    return await this.db
      .selectFrom('game')
      .selectAll()
      .where(filter)
      .offset(offset)
      .limit(limit)
      .execute();
  }

  static byName(name: string): GameFilter {
    return eb => eb('name', 'ilike', name + '%');
  }

  static byCategories(categories: GameCategory[]): GameFilter {
    return eb => eb('categories', '@>', categories);
  }

  static byAuthor(authorId: string): GameFilter {
    return builder => builder('authorId', '=', authorId);
  }
}
