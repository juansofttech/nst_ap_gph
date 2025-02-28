import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create the Nest application
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Automatically strip properties that do not have decorators
    forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
    transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    // Optionally, you can add additional options:
    // disableErrorMessages: false, // Set to true to disable error messages in production
    // validationError: { target: false }, // Set to false to not include the target object in validation errors
  }));

  // Enable CORS (Cross-Origin Resource Sharing) if needed
  app.enableCors();

  // Start the application and listen on the specified port
  const port = process.env.PORT || 3000; // Default to port 3000 if not specified
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`); // Log the running port
}

bootstrap();