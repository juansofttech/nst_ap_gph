import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, IsNumber } from 'class-validator';

@InputType()
export class UpdateUser  {
    @Field(() => Number)
    id: number;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsEmail()
    email?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    firstName?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    lastName?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    city?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    country?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @Field(() => Number, { nullable: true })
    @IsOptional()
    @IsNumber()
    latitude?: number;

    @Field(() => Number, { nullable: true })
    @IsOptional()
    @IsNumber()
    longitude?: number;
}