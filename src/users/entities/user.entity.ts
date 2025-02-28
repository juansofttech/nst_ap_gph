import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class User {
    @Field(() => Int)
    id: number;

    @Field(() => String)
    email: string;

    @Field(() => String)
    password: string; // Consider omitting this for security reasons

    @Field(() => String)
    firstName: string;

    @Field(() => String)
    lastName: string;

    @Field(() => String, { nullable: true })
    city?: string;

    @Field(() => String, { nullable: true })
    country?: string;

    @Field(() => String, { nullable: true })
    phoneNumber?: string;

    @Field(() => Float, { nullable: true })
    latitude?: number;

    @Field(() => Float, { nullable: true })
    longitude?: number;
}