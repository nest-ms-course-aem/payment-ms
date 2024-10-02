import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger();

  const app = await NestFactory.create(AppModule, {
    rawBody:  true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  //? To become this hybrid we still need to maintain the app instantiation above and just set the connectMicroservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: envs.natsServer,
    }
  },{inheritAppConfig: true}) // In the end we add this to make inherite app pipes and class validators config, hybrid app by default doesn't do it

  await app.startAllMicroservices();
  await app.listen(envs?.port);

  logger.verbose(`Payments microservice running on port ${envs?.port}`)
}
bootstrap();
