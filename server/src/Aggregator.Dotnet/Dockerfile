# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/Aggregator.Dotnet/Aggregator.Dotnet.csproj", "src/Aggregator.Dotnet/"]
COPY ["src/Services/AuthService.Dotnet/AuthService.Dotnet.Grpc/AuthService.Dotnet.Grpc.csproj", "src/Services/AuthService.Dotnet/AuthService.Dotnet.Grpc/"]
COPY ["src/Services/AuthService.Dotnet/AuthService.Dotnet.Persistence/AuthService.Dotnet.Persistence.csproj", "src/Services/AuthService.Dotnet/AuthService.Dotnet.Persistence/"]
COPY ["src/Services/AuthService.Dotnet/AuthService.Dotnet.Infrastructure/AuthService.Dotnet.Infrastructure.csproj", "src/Services/AuthService.Dotnet/AuthService.Dotnet.Infrastructure/"]
COPY ["src/Services/AuthService.Dotnet/AuthService.Dotnet.Application/AuthService.Dotnet.Application.csproj", "src/Services/AuthService.Dotnet/AuthService.Dotnet.Application/"]
COPY ["src/Services/AuthService.Dotnet/AuthService.Dotnet.Domain/AuthService.Dotnet.Domain.csproj", "src/Services/AuthService.Dotnet/AuthService.Dotnet.Domain/"]
RUN dotnet restore "./src/Aggregator.Dotnet/Aggregator.Dotnet.csproj"
COPY . .
WORKDIR "/src/src/Aggregator.Dotnet"
RUN dotnet build "./Aggregator.Dotnet.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Aggregator.Dotnet.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Aggregator.Dotnet.dll"]