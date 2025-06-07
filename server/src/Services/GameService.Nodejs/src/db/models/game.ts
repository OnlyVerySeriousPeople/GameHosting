import {DB, GameCategory} from '../../gen_kysely';
import {Kysely, sql} from 'kysely';
import {HandleError} from '@game-hosting/common/db_model_utils';

export class GameModel {
  constructor(private readonly db: Kysely<DB>) {}

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
}
