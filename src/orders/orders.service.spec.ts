import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { CreateOrderInput } from './order.dto'; // Import CreateOrderInput

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined / 应该被定义 / devrait être défini', () => {
    expect(service).toBeDefined();
  });

  it('should return all orders / 应该返回所有订单 / devrait retourner toutes les commandes', () => {
    expect(service.findAll()).toHaveLength(2); // Assuming you have 2 initial orders
  });

  it('should return a single order by id / 应该通过 ID 返回单个订单 / devrait retourner une seule commande par ID', () => {
    expect(service.findOne(1)).toBeDefined();
  });

  it('should create a new order / 应该创建一个新订单 / devrait créer une nouvelle commande', () => {
    const newOrder: CreateOrderInput = { // Use CreateOrderInput type here
      productId: 1,
      customerName: 'Alice',
      quantity: 3,
      price: 100, // Provide a price
      status: 'Pending', // Provide a status
    };
    const createdOrder = service.create(newOrder); // Pass CreateOrderInput to create method
    expect(createdOrder).toHaveProperty('id'); // Check if 'id' is generated
    expect(createdOrder.customerName).toBe('Alice');
  });
});