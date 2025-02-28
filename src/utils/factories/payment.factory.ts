import { faker } from '@faker-js/faker';
import { CreatePaymentInput } from '../../payments/create-payment.input'; // Adjust the import path as necessary

export const generateFakePayment = (): CreatePaymentInput => {
    return {
        orderId: faker.string.alphanumeric(8), // Generate a random order ID
        amount: parseFloat(faker.commerce.price()), // Generate a random amount
        method: faker.helpers.arrayElement(['credit_card', 'paypal', 'bank_transfer']), // Random payment method
        description: faker.commerce.productDescription(), // Generate a random description
    };
};

export const generateMultipleFakePayments = (count: number): CreatePaymentInput[] => {
    return Array.from({ length: count }, () => generateFakePayment());
};