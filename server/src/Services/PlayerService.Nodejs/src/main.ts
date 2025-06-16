import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PLAYERS_PACKAGE_NAME } from '@proto/types';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: PLAYERS_PACKAGE_NAME,
      protoPath: join(process.cwd(), 'proto/player_service.proto'),
      url: 'localhost:50051',
    },
  });

  await app.startAllMicroservices();
}

bootstrap();
