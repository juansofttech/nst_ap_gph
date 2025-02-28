// src/orders/orders.resolver.ts
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateOrderInput, Order } from './order.dto';
import { OrdersService } from './orders.service';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private ordersService: OrdersService) { }

  @Query(() => [Order])
  getOrders() {
    return this.ordersService.findAll();
  }

  @Query(() => Order, { nullable: true })
  getOrder(@Args('id') id: number) {
    return this.ordersService.findOne(id);
  }

  @Mutation(() => Order)
  createOrder(@Args('order') order: CreateOrderInput) {
    return this.ordersService.create(order);
  }

  @Mutation(() => Order)
  updateOrder(
    @Args('id') id: number,
    @Args('order') order: CreateOrderInput,
  ) {
    return this.ordersService.update(id, order);
  }

  @Mutation(() => Order)
  deleteOrder(@Args('id') id: number) {
    return this.ordersService.delete(id);
  }
}