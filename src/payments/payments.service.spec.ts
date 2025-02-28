import { getQueueToken } from '@nestjs/bull'; // Import Bull's getQueueToken
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bull'; // Import Bull's Queue
import * as request from 'supertest';
import { AppModule } from '../app.module'; // Adjust the import path as necessary
import { generateMultipleFakePayments } from '../utils/factories/payment.factory'; // Adjust the import path as necessary

describe('Payments GraphQL', () => {
  let app: INestApplication;
  let mockQueue: Queue;

  beforeAll(async () => {
    // Create a mock for the Bull queue
    mockQueue = {
      add: jest.fn(), // Mock the add method
    } as unknown as Queue;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getQueueToken('generic')) // Override the queue provider
      .useValue(mockQueue) // Use the mocked queue
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create multiple payments with valid data', async () => {
    const fakePayments = generateMultipleFakePayments(5); // Generate 5 fake payments

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
                    mutation {
                        createMultiplePayments(createMultiplePaymentsData: {
                            payments: ${JSON.stringify(fakePayments).replace(/"([^"]+)":/g, '$1:')}
                        }) {
                            id
                            orderId
                            amount
                            method
                            description
                            createdAt
                        }
                    }
                `,
      })
      .expect(200);

    expect(response.body.data.createMultiplePayments).toBeDefined();
    expect(response.body.data.createMultiplePayments.length).toBe(5); // Expecting 5 payments to be created
  });

  it('should create multiple payments with an invalid orderId length', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
                    mutation {
                        createMultiplePayments(createMultiplePaymentsData: {
                            payments: [
                                { orderId: "O", amount: 100.00, method: "credit_card", description: "Payment for order ORD001" },  # Invalid orderId
                                { orderId: "ORD002", amount: 150.00, method: "paypal", description: "Payment for order ORD002" },
                                { orderId: "ORD003", amount: 200.00, method: "bank_transfer", description: "Payment for order ORD003" },
                                { orderId: "ORD004", amount: 250.00, method: "credit_card", description: "Payment for order ORD004" },
                                { orderId: "ORD005", amount: 300.00, method: "credit_card", description: "Payment for order ORD005" }
                            ]
                        }) {
                            id
                            orderId
                            amount
                            method
                            description
                            createdAt
                        }
                    }
                `,
      })
      .expect(400); // Expecting a 400 Bad Request due to validation error

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toContain('Invalid orderId length');
  });

  it('should create multiple payments with an invalid method length', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
                    mutation {
                        createMultiplePayments(createMultiplePaymentsData: {
                            payments: [
                                { orderId: "ORD001", amount: 100.00, method: "cc", description: "Payment for order ORD001" },  # Invalid method
                                { orderId: "ORD002", amount: 150.00, method: "paypal", description: "Payment for order ORD002" },
                                { orderId: "ORD003", amount: 200.00, method: "bank_transfer", description: "Payment for order ORD003" },
                                { orderId: "ORD004", amount: 250.00, method: "credit_card", description: "Payment for order ORD004" },
                                { orderId: "ORD005", amount: 300.00, method: "credit_card", description: "Payment for order ORD005" }
                            ]
                        }) {
                            id
                            orderId
                            amount
                            method
                            description
                            createdAt
                        }
                    }
                `,
      })
      .expect(400); // Expecting a 400 Bad Request due to validation error

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toContain('Invalid method length');
  });

  it('should create multiple payments with an invalid description length', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
                    mutation {
                        createMultiplePayments(createMultiplePaymentsData: {
                            payments: [
                                { orderId: "ORD001", amount: 100.00, method: "credit_card", description: "This description is way too long and exceeds the maximum length of one hundred characters, which is not allowed." },  # Invalid description
                                { orderId: "ORD002", amount: 150.00, method: "paypal", description: "Payment for order ORD002" },
                                { orderId: "ORD003", amount: 200.00, method: "bank_transfer", description: "Payment for order ORD003" },
                                { orderId: "ORD004", amount: 250.00, method: "credit_card", description: "Payment for order ORD004" },
                                { orderId: "ORD005", amount: 300.00, method: "credit_card", description: "Payment for order ORD005" }
                            ]
                        }) {
                            id
                            orderId
                            amount
                            method
                            description
                            createdAt
                        }
                    }
                `,
      })
      .expect(400); // Expecting a 400 Bad Request due to validation error

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toContain('Invalid description length');
  });

  it('should process a payment job', async () => {
    const fakePayment = generateMultipleFakePayments(1)[0]; // Generate a single fake payment

    // Add the job to the queue
    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
                    mutation {
                        createPaymentJob(input: {
                            orderId: "${fakePayment.orderId}",
                            amount: ${fakePayment.amount},
                            method: "${fakePayment.method}",
                            description: "${fakePayment.description}"
                        }) {
                            message
                        }
                    }
                `,
      })
      .expect(200);

    // Check if the job was added to the queue
    // Check if the job was added to the queue
    expect(mockQueue.add).toHaveBeenCalledWith({
      orderId: fakePayment.orderId,
      amount: fakePayment.amount,
      method: fakePayment.method,
      description: fakePayment.description,
    });
  });
});