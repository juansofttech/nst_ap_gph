import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bull'; // Import BullModule
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler'; // Import ThrottlerModule
import * as path from 'path'; // Import path module
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { GqlThrottlerGuard } from './utils/gql-throttler.guard'; // Adjust the path as necessary

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '../../../.config/.env'), // Specify the path to your .env file
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost', // Adjust as necessary
        port: 6379, // Adjust as necessary
      },
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default', // Name for the throttler
        ttl: 60, // Time to live in seconds
        limit: 10, // Maximum requests per TTL
      },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true, // Automatically generate the schema file
      playground: true, // Enable playground for testing
    }),
    ProductsModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    OrdersModule,
    PaymentsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard, // Use the custom GqlThrottlerGuard
    },
  ],
})
export class AppModule { }