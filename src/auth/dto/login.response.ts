import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
    @Field()
    access_token: string; // The JWT token returned after successful login
}