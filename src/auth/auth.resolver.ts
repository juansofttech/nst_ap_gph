import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login.response'; // Ensure this DTO is defined correctly

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse) // Define the return type
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> { // Ensure the return type matches the DTO
    return this.authService.login(email, password);
  }
}