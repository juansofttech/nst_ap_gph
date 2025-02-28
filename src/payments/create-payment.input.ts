import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested, Length } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreatePaymentInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    @Length(3, 20) // Order ID must be between 3 and 20 characters
    orderId: string;

    @Field(() => Float)
    @IsNumber()
    @IsNotEmpty()
    amount: number; // Amount can be any valid number, no length restriction

    @Field()
    @IsString()
    @IsNotEmpty()
    @Length(3, 15) // Payment method must be between 3 and 15 characters
    method: string; // e.g., 'credit_card', 'paypal', etc.

    @Field({ nullable: true })
    @IsString()
    @Length(0, 100) // Description can be up to 100 characters
    description?: string; // Optional field
}

@InputType()
export class CreateMultiplePaymentsInput {
    @Field(() => [CreatePaymentInput])
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePaymentInput) // Important for class-transformer to work correctly
    payments: CreatePaymentInput[];
}

@InputType()
export class DeleteMultiplePaymentsInput {
    @Field(() => [String])
    @IsArray()
    ids: string[];
}