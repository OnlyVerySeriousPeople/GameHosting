# Game service

### GoF patterns:

- [Singleton](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/GameService.Nodejs/src/db/index.ts#L13)
- [Facade (using JS modules)](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/GameService.Nodejs/src/gen_proto.ts)
- [Strategy](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/GameService.Nodejs/src/db/models/game.ts#L92)

### Other patterns:

- [Dependency injection](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/GameService.Nodejs/src/services/game_service.ts#L22)
- [Data access object](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/GameService.Nodejs/src/db/models/game.ts)
- [Data transfer object](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/GameService.Nodejs/src/dtos/game/index.ts)
