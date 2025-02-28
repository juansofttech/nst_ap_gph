import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module'; // Import UsersModule
import { CryptoService } from '../utils/securiityutils/crypto-service.util'; // Import CryptoService
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'gqrreeyjyzVahzUU+zsB1jY0tOhBlz5dgWqAyoA1E6o=', // Use environment variable for the secret key
      signOptions: { expiresIn: '60s' }, // Token expiration time
    }),
  ],
  providers: [AuthService, AuthResolver, CryptoService], // Add CryptoService to providers
})
export class AuthModule { }