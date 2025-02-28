import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from '../users/dtos/create-user.input'; // Import CreateUser  Input
import { User, UsersService } from '../users/users.service'; // Adjust the import path as necessary
import { CryptoService } from '../utils/securiityutils/crypto-service.util'; // Import CryptoService

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private cryptoService: CryptoService, // Inject CryptoService
  ) { }

  // Login method to generate JWT token
  async login(email: string, password: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || !(await this.cryptoService.comparePassword(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email }; // Use user ID and email for the payload
    return {
      access_token: this.jwtService.sign(payload), // Generate JWT token
    };
  }

  // Register method to create a new user
  async register(input: CreateUserInput): Promise<User> {
    // Use the createUser  method from UsersService
    return await this.usersService.createUser(input);
  }
}