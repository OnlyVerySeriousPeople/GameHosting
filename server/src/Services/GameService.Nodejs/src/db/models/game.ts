import {DB, GameCategory} from '../../gen_kysely';
import {ExpressionOrFactory, Kysely, SqlBool, sql} from 'kysely';
import {DatabaseError} from '@game-hosting/common/errors';
import {HandleError} from '@game-hosting/common/db_model_utils';

export class GameModel {
  constructor(private readonly db: Kysely<DB>) {}

  private static validCategories(categories: string[]) {
    const validValues = Object.values(GameCategory) as string[];
    const invalidValue = categories.find(ctg => !validValues.includes(ctg));
    if (invalidValue) {
      throw new DatabaseError(`invalid game category: ${invalidValue}`);
    }

    return categories as GameCategory[];
  }

  @HandleError
  async createGame({
    name,
    description,
    categories,
    iconUrl,
    authorId,
  }: {
    name: string;
    description?: string;
    categories?: string[];
    iconUrl?: string;
    authorId: string;
  }) {
    await this.db
      .insertInto('game')
      .values({
        name,
        description,
        iconUrl,
        categories: categories ? GameModel.validCategories(categories) : null,
        authorId,
      })
      .execute();
  }

  @HandleError
  async updateGame(
    gameId: string,
    updates: {
      name?: string;
      description?: string;
      categories?: string[];
      iconUrl?: string;
    },
  ) {
    if (Object.keys(updates).length === 0) {
      throw new DatabaseError('no values to update');
    }

    const {categories, ...rest} = updates;
    await this.db
      .updateTable('game')
      .set({
        ...rest,
        ...{
          categories: categories
            ? GameModel.validCategories(categories)
            : undefined,
        },
      })
      .where('id', '=', gameId)
      .execute();
  }

  @HandleError
  async deleteGame(gameId: string) {
    await this.db.deleteFrom('game').where('id', '=', gameId).execute();
  }

  @HandleError
  async getGameCategories({onlyUsed}: {onlyUsed: boolean}) {
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
    filter: ExpressionOrFactory<DB, 'game', SqlBool>,
    offset: number,
    limit: number,
  ) {
    return await this.db
      .selectFrom('game')
      .selectAll()
      .where(filter)
      .offset(offset)
      .limit(limit)
      .execute();
  }

  static byName(name: string): ExpressionOrFactory<DB, 'game', SqlBool> {
    return eb => eb('name', 'ilike', name + '%');
  }

  static byCategories(
    categories: string[],
  ): ExpressionOrFactory<DB, 'game', SqlBool> {
    return eb => eb('categories', '@>', GameModel.validCategories(categories));
  }

  static byAuthor(authorId: string): ExpressionOrFactory<DB, 'game', SqlBool> {
    return builder => builder('authorId', '=', authorId);
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
}
