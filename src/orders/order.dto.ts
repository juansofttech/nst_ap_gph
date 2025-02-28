// src/orders/order.dto.ts
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType()
export class Order {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  productId: number;

  @Field()
  customerName: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Int) // Ensure this field is included
  price: number; // Added price field

  @Field()
  status: string; // Added status field
}

@InputType()
export class CreateOrderInput {
  @Field(() => Int)
  productId: number;

  @Field()
  customerName: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Int) // Ensure this field is included
  price: number; // Added price field

  @Field()
  status: string; // Added status field
}