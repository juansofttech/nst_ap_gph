// src/orders/orders.resolver.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersResolver } from './orders.resolver';
import { OrdersService } from './orders.service';
import { Order } from './order.dto';

describe('OrdersResolver', () => {
  let resolver: OrdersResolver;
  let ordersService: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersResolver,
        {
          provide: OrdersService,
          useValue: {
            findAll: jest.fn().mockReturnValue([]),
            findOne: jest.fn().mockReturnValue(null),
            create: jest.fn().mockReturnValue({ id: 1, productId: 1, customerName: 'Alice', quantity: 3 }),
          },
        },
      ],
    }).compile();

    resolver = module.get<OrdersResolver>(OrdersResolver);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return an array of orders', async () => {
    const result = await resolver.getOrders();
    expect(result).toEqual([]);
    expect(ordersService.findAll).toHaveBeenCalled();
  });

  it('should return a single order by id', async () => {
    const orderId = 1;
    const result = await resolver.getOrder(orderId);
    expect(result).toBeNull();
    expect(ordersService.findOne).toHaveBeenCalledWith(orderId);
  });

  it('should create a new order', async () => {
    const newOrder: Order = { productId: 1, customerName: 'Alice', quantity: 3 } as Order;
    const result = await resolver.createOrder(newOrder);
    expect(result).toHaveProperty('id');
    expect(result.customerName).toBe('Alice');
    expect(ordersService.create).toHaveBeenCalledWith(newOrder);
  });
});