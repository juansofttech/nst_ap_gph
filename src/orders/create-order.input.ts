import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class PaymentInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    orderId: string;

    @Field()
    @IsNumber()
    amount: number;

    @Field()
    @IsString()
    method: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    description: string;
}