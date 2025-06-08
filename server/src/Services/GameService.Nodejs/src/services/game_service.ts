import * as proto from '../gen_proto';
import {
  CheckReq,
  greaterThanZero,
  nonEmptyStr,
  plainObj,
} from '@game-hosting/common/dto_validators';
import {Database, GameFilter, GameModel} from '../db';
import {
  HandleError,
  LogEndpoint,
} from '@game-hosting/common/grpc_service_utils';
import {RequestError} from '@game-hosting/common/errors';
import {create} from '@bufbuild/protobuf';
import {toGameDto} from '../dtos/game';

export class GameService {
  private readonly model: GameModel;

  constructor({game}: Database) {
    this.model = game;
  }

  @LogEndpoint('CreateGame')
  @HandleError('cannot create such game')
  @CheckReq<proto.CreateGameRequest>(
    nonEmptyStr('authorId'),
    plainObj('metadata'),
  )
  async createGame({
    authorId,
    metadata,
  }: proto.CreateGameRequest): Promise<proto.CreateGameResponse> {
    nonEmptyStr(metadata!.name);

    const {$typeName, categories, ...rest} = metadata!;
    await this.model.createGame({
      authorId,
      categories: categories && GameModel.validCategories(categories),
      ...rest,
    });

    return create(proto.CreateGameResponseSchema, {});
  }

  @LogEndpoint('UpdateGame')
  @HandleError('cannot update metadata of this game')
  @CheckReq<proto.UpdateGameRequest>(
    nonEmptyStr('gameId'),
    plainObj('metadata'),
  )
  async updateGame({
    gameId,
    metadata,
  }: proto.UpdateGameRequest): Promise<proto.UpdateGameResponse> {
    if (Object.keys(metadata!).length === 0) {
      throw new RequestError('no values to update');
    }

    const {$typeName, categories, ...rest} = metadata!;
    await this.model.updateGame(gameId, {
      categories: categories && GameModel.validCategories(categories),
      ...rest,
    });

    return create(proto.UpdateGameResponseSchema, {});
  }

  @LogEndpoint('IncGamePlays')
  @HandleError('cannot increment number of plays for this game')
  @CheckReq<proto.IncGamePlaysRequest>(nonEmptyStr('gameId'))
  async incGamePlays({
    gameId,
  }: proto.IncGamePlaysRequest): Promise<proto.IncGamePlaysResponse> {
    await this.model.incGamePlaysCt(gameId);

    return create(proto.IncGamePlaysResponseSchema, {});
  }

  @LogEndpoint('DeleteGame')
  @HandleError('cannot delete this game')
  @CheckReq<proto.DeleteGameRequest>(nonEmptyStr('gameId'))
  async deleteGame({
    gameId,
  }: proto.DeleteGameRequest): Promise<proto.DeleteGameResponse> {
    await this.model.deleteGame(gameId);

    return create(proto.DeleteGameResponseSchema, {});
  }

  @LogEndpoint('GetGameCategories')
  @HandleError()
  async getGameCategories({
    onlyUsed,
  }: proto.GetGameCategoriesRequest): Promise<proto.GetGameCategoriesResponse> {
    const categories = await this.model.getGameCategories(onlyUsed);

    return create(proto.GetGameCategoriesResponseSchema, {categories});
  }

  @LogEndpoint('GetGames')
  @HandleError('cannot get games by this filter')
  @CheckReq<proto.GetGamesRequest>(greaterThanZero('limit'))
  async getGames({
    filterBy,
    categories,
    offset,
    limit,
  }: proto.GetGamesRequest): Promise<proto.GetGamesResponse> {
    const filter = ((): GameFilter => {
      const {case: filterType, value} = filterBy;
      switch (filterType) {
        case 'name': {
          nonEmptyStr(value);
          return GameModel.byName(value);
        }
        case 'useCategories': {
          if (categories.length === 0) {
            throw new RequestError('no categories to filter by');
          }
          return GameModel.byCategories(GameModel.validCategories(categories));
        }
        case 'authorId': {
          nonEmptyStr(value);
          return GameModel.byAuthor(value);
        }
        default: {
          throw new RequestError(
            `invalid game filter specified: ${filterType}`,
          );
        }
      }
    })();

    const games = await this.model.getGames(filter, offset, limit);

    return create(proto.GetGamesResponseSchema, {
      games: games.map(game => toGameDto(game)),
    });
  }
}
