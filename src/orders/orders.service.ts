// src/orders/orders.service.ts
import { Injectable } from '@nestjs/common';
import { Order, CreateOrderInput } from './order.dto';

@Injectable()
export class OrdersService {
  private orders: Order[] = [
    { id: 1, productId: 1, customerName: 'John Doe', quantity: 2, price: 100, status: 'pending' },
    { id: 2, productId: 2, customerName: 'Jane Doe', quantity: 1, price: 50, status: 'completed' },
  ];

  findAll(): Order[] {
    return this.orders;
  }

  findOne(id: number): Order {
    return this.orders.find(order => order.id === id);
  }

  create(orderInput: CreateOrderInput): Order {
    const newOrder: Order = {
      id: this.orders.length + 1, // Simple ID generation
      ...orderInput, // Spread the input to include all fields
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  // Add the update method
  update(id: number, orderInput: CreateOrderInput): Order {
    const orderIndex = this.orders.findIndex(order => order.id === id);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    const updatedOrder = { ...this.orders[orderIndex], ...orderInput };
    this.orders[orderIndex] = updatedOrder;
    return updatedOrder;
  }

  // Add the delete method
  delete(id: number): Order {
    const orderIndex = this.orders.findIndex(order => order.id === id);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    const deletedOrder = this.orders[orderIndex];
    this.orders.splice(orderIndex, 1);
    return deletedOrder;
  }
}