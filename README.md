# GameHosting

GameHosting is a simple multiplayer game hosting platform built using a microservice architecture. It enables lightweight, scalable hosting of real-time multiplayer games with support for rooms, teams, and game state management.

The system is composed of multiple services written in both TypeScript and C#, communicating over gRPC using Protocol Buffers, allowing for clean service boundaries and polyglot development.

## Features:

- ⚙️ Microservice-based design for modularity and scalability
- 🔁 Cross-language service communication via gRPC and Protobuf
- 🎮 Host simple multiplayer games with team/room logic (synchronization can be implemented via WebSocket messages)

## Status

> [!WARNING]
> This project is under active development.
> Expect frequent changes and experimental features.

## Authors

- Кушнір Микола Миколайович
    - [Common modules for Node.js](https://github.com/OnlyVerySeriousPeople/GameHosting/tree/main/server/src/BuildingBlocks/Common.Nodejs)
    - [Game service](https://github.com/OnlyVerySeriousPeople/GameHosting/tree/main/server/src/Services/GameService.Nodejs)
    - [Leaderboard service](https://github.com/OnlyVerySeriousPeople/GameHosting/tree/main/server/src/Services/LeaderboardService.Nodejs)
    - [Match service](https://github.com/OnlyVerySeriousPeople/GameHosting/tree/main/server/src/Services/MatchService.Nodejs)
    - [GameHosting SDK](https://github.com/OnlyVerySeriousPeople/GameHosting/tree/main/sdk)
