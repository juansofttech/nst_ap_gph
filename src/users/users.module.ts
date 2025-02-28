import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver'; // Import the UsersResolver

@Module({
  providers: [UsersService, UsersResolver], // Add UsersResolver to providers
  exports: [UsersService],
})
export class UsersModule {}