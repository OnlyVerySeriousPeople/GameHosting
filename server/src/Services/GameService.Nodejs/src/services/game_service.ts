import * as proto from '../gen_proto';
import {Database, GameModel} from '../db';
import {create} from '@bufbuild/protobuf';

export class GameService {
  private readonly model: GameModel;

  constructor({game}: Database) {
    this.model = game;
  }

  async getGameCategories({
    onlyUsed,
  }: proto.GetGameCategoriesRequest): Promise<proto.GetGameCategoriesResponse> {
    const categories = await this.model.getGameCategories(onlyUsed);

    return create(proto.GetGameCategoriesResponseSchema, {categories});
  }
}
