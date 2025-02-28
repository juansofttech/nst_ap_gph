import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Payment {
    @Field(() => Int)
    id: number;

    @Field()
    orderId: string;

    @Field(() => Float)
    amount: number;

    @Field()
    method: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    createdAt: Date;
}