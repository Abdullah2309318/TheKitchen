import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- MODIFIED CORS SECTION ---
  const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';

  app.enableCors({
    origin: [frontendURL], // Use the environment variable here
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  // -----------------------------

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`API listening on port: ${port}`);
}
bootstrap();