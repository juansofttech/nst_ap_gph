import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateOrderInput {
    @Field({ nullable: true })  // Keep id as a number
    id?: number;

    @Field({ nullable: true })
    product?: string;

    @Field({ nullable: true })
    quantity?: number;

    @Field({ nullable: true })
    price?: number;

    @Field({ nullable: true })
    status?: string;
}