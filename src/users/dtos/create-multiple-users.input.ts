import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserInput } from './create-user.input'; // Adjust the import path as necessary

@InputType()
export class CreateMultipleUsersInput {
    @Field(() => [CreateUserInput])
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateUserInput) // Important for class-transformer to work correctly
    users: CreateUserInput[];
}