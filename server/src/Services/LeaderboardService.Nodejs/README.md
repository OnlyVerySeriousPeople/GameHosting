# Leaderboard service

### GoF patterns:

- [Singleton](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/LeaderboardService.Nodejs/src/db/index.ts#L9)
- [Facade (using JS modules)](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/LeaderboardService.Nodejs/src/gen_proto.ts)
- [Proxy](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/LeaderboardService.Nodejs/src/cache/models/leaderboard.ts)

### Other patterns:

- [Dependency injection](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/LeaderboardService.Nodejs/src/services/leaderboard_service.ts#L23)
- [Data access object](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/LeaderboardService.Nodejs/src/db/models/leaderboard.ts)
- [Data transfer object](https://github.com/OnlyVerySeriousPeople/GameHosting/blob/main/server/src/Services/LeaderboardService.Nodejs/src/dtos/leaderboard/index.ts)
