import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePaymentInput, CreateMultiplePaymentsInput, DeleteMultiplePaymentsInput } from './create-payment.input';
import { Payment } from './payment.dto';
import { PaymentsResolver } from './payments.resolver';
import { PaymentsService } from './payments.service';
import { faker } from '@faker-js/faker';

describe('PaymentsResolver', () => {
  let resolver: PaymentsResolver;
  let service: PaymentsService;

  // Function to generate a mock payment using faker
  //[@TousJuan]
  const generateMockPayment = (): Payment => ({
    id: faker.number.int({ min: 1 }), // Use faker.number.int() for integers
    orderId: faker.string.alphanumeric(8), // Generate a random alphanumeric string for orderId
    amount: parseFloat(faker.finance.amount()), // Generate a random float for amount
    method: faker.finance.transactionType(), // Generate a random transaction type
    description: faker.lorem.sentence(), // Generate a random sentence for description
    createdAt: new Date(),
  });

  const mockPayment = generateMockPayment();

  const mockPaymentsService = {
    findAll: jest.fn().mockResolvedValue([mockPayment]),
    findOne: jest.fn((id: number) => {
      if (id === mockPayment.id) {
        return mockPayment;
      }
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }),
    create: jest.fn((input: CreatePaymentInput) => {
      return { id: 2, ...input, createdAt: new Date() }; // Simulate creating a new payment
    }),
    createMultiple: jest.fn((inputs: CreatePaymentInput[]) => {
      return inputs.map((input, index) => ({
        id: index + 3, // Simulate new IDs starting from 3
        ...input,
        createdAt: new Date(),
      }));
    }),
    delete: jest.fn((id: number) => {
      if (id === mockPayment.id) {
        return mockPayment;
      }
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }),
    deleteMultiple: jest.fn((ids: number[]) => {
      const deletedPayments = [];
      ids.forEach(id => {
        if (id === mockPayment.id) {
          deletedPayments.push(mockPayment);
        } else {
          throw new NotFoundException(`Payment with ID ${id} not found`);
        }
      });
      return deletedPayments;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsResolver,
        { provide: PaymentsService, useValue: mockPaymentsService },
      ],
    }).compile();

    resolver = module.get<PaymentsResolver>(PaymentsResolver);
    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getPayments', () => {
    it('should return an array of payments', async () => {
      const result = await resolver.getPayments();
      expect(result).toEqual([mockPayment]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getPayment', () => {
    it('should return a payment by ID', async () => {
      const result = await resolver.getPayment(mockPayment.id);
      expect(result).toEqual(mockPayment);
      expect(service.findOne).toHaveBeenCalledWith(mockPayment.id);
    });

    it('should throw an error if payment not found', async () => {
      await expect(resolver.getPayment(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createPayment', () => {
    it('should create a new payment', async () => {
      const input: CreatePaymentInput = {
        orderId: faker.string.alphanumeric(8),
        amount: parseFloat(faker.finance.amount()),
        method: faker.finance.transactionType(),
        description: faker.lorem.sentence(),
      };
      const result = await resolver.createPayment(input);
      expect(result).toEqual({ id: 2, ...input, createdAt: expect.any(Date) });
      expect(service.create).toHaveBeenCalledWith(input);
    });

    it('should throw an error if orderId is too short', async () => {
      const input: CreatePaymentInput = {
        orderId: 'O', // Invalid orderId
        amount: 200.00,
        method: 'paypal',
        description: 'Payment for order ORD002',
      };
      await expect(resolver.createPayment(input)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if method is too short', async () => {
      const input: CreatePaymentInput = {
        orderId: 'ORD002',
        amount: 200.00,
        method: 'cc', // Invalid method
        description: 'Payment for order ORD002',
      };
      await expect(resolver.createPayment(input)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if description is too long', async () => {
      const input: CreatePaymentInput = {
        orderId: 'ORD002',
        amount: 200.00,
        method: 'paypal',
        description: 'This description is way too long and exceeds the maximum length of one hundred characters, which is not allowed.', // Invalid description
      };
      await expect(resolver.createPayment(input)).rejects.toThrow(BadRequestException);
    });
  });

  describe('createMultiplePayments', () => {
    it('should create multiple payments', async () => {
      const input: CreateMultiplePaymentsInput = {
        payments: [
          {
            orderId: faker.string.alphanumeric(8),
            amount: parseFloat(faker.finance.amount()),
            method: faker.finance.transactionType(),
            description: faker.lorem.sentence(),
          },
          {
            orderId: faker.string.alphanumeric(8),
            amount: parseFloat(faker.finance.amount()),
            method: faker.finance.transactionType(),
            description: faker.lorem.sentence(),
          },
        ],
      };
      const result = await resolver.createMultiplePayments(input);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 3, ...input.payments[0], createdAt: expect.any(Date) });
      expect(result[1]).toEqual({ id: 4, ...input.payments[1], createdAt: expect.any(Date) });
      expect(service.createMultiple).toHaveBeenCalledWith(input.payments);
    });

    it('should throw an error if any payment has an invalid orderId', async () => {
      const input: CreateMultiplePaymentsInput = {
        payments: [
          { orderId: 'O', amount: 300.00, method: 'credit_card', description: 'Payment for order ORD003' }, // Invalid orderId
          { orderId: faker.string.alphanumeric(8), amount: 400.00, method: 'paypal', description: 'Payment for order ORD004' },
        ],
      };
      await expect(resolver.createMultiplePayments(input)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if any payment has an invalid method', async () => {
      const input: CreateMultiplePaymentsInput = {
        payments: [
          { orderId: faker.string.alphanumeric(8), amount: 300.00, method: 'cc', description: 'Payment for order ORD003' }, // Invalid method
          { orderId: faker.string.alphanumeric(8), amount: 400.00, method: 'paypal', description: 'Payment for order ORD004' },
        ],
      };
      await expect(resolver.createMultiplePayments(input)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if any payment has an invalid description', async () => {
      const input: CreateMultiplePaymentsInput = {
        payments: [
          { orderId: faker.string.alphanumeric(8), amount: 300.00, method: 'credit_card', description: 'This description is way too long and exceeds the maximum length of one hundred characters, which is not allowed.' }, // Invalid description
          { orderId: faker.string.alphanumeric(8), amount: 400.00, method: 'paypal', description: 'Payment for order ORD004' },
        ],
      };
      await expect(resolver.createMultiplePayments(input)).rejects.toThrow(BadRequestException);
    });
  });

  describe('deletePayment', () => {
    it('should delete a payment by ID', async () => {
      const result = await resolver.deletePayment(1);
      expect(result).toEqual(mockPayment);
      expect(service.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an error if payment not found', async () => {
      await expect(resolver.deletePayment(999)).rejects.toThrow(NotFoundException);
    });
  });


  // [SDT-TCK 80% :Pending Rtest]  
  describe('deleteMultiplePayments', () => {
    it('should delete multiple payments by IDs', async () => {
      const input: DeleteMultiplePaymentsInput = {
        ids: ['1'], // Change this to a string
      };
      const result = await resolver.deleteMultiplePayments(input);
      expect(result).toEqual([mockPayment]);
      expect(service.deleteMultiple).toHaveBeenCalledWith(input.ids);
    });

    it('should throw an error if any payment ID is not found', async () => {
      const input: DeleteMultiplePaymentsInput = {
        ids: ['999'], // Change this to a string
      };
      await expect(resolver.deleteMultiplePayments(input)).rejects.toThrow(NotFoundException);
    });
  });

});


