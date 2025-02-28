import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login.response'; // Ensure this DTO is defined correctly

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) // Set the response status code to 200 for successful login
  async login(@Body() body: { email: string; password: string }): Promise<LoginResponse> {
    const { email, password } = body;
    const loginResponse = await this.authService.login(email, password);
    
    if (!loginResponse) {
      throw new UnauthorizedException('Invalid credentials'); // Throw an exception if login fails
    }

    return loginResponse; // Return the access token
  }
}