import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nestjs first application')
    .setDescription('REST API Documentary')
    .setVersion('1.0.0')
    .addTag('v1')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/swagger', app, swaggerDocument);
  await app.listen(PORT, () =>
    console.log(`Server has started on port: ${PORT}`),
  );
}

start();
