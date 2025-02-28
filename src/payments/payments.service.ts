import { InjectQueue } from '@nestjs/bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bull';
import { CreatePaymentInput } from './create-payment.input'; // Ensure you import the new input type
import { Payment } from './payment.dto';

@Injectable()
export class PaymentsService {
    private payments: Payment[] = []; // In-memory storage for payments
    private idCounter = 1; // Simple ID counter

    constructor(@InjectQueue('generic') private jobQueue: Queue) { } // Inject the job queue

    // Retrieve all payments
    findAll(): Payment[] {
        return this.payments;
    }

    // Retrieve a specific payment by ID
    findOne(id: number): Payment {
        const payment = this.payments.find(payment => payment.id === id);
        if (!payment) {
            throw new NotFoundException(`Payment with ID ${id} not found`);
        }
        return payment;
    }

    // Create a new payment
    create(input: CreatePaymentInput): Payment {
        const newPayment: Payment = {
            id: this.idCounter++, // Increment the ID counter
            ...input, // Spread the input properties
            createdAt: new Date(), // Set the creation date
        };
        this.payments.push(newPayment); // Add the new payment to the in-memory array
        return newPayment; // Return the newly created payment
    }

    // Create multiple payments
    createMultiple(inputs: CreatePaymentInput[]): Payment[] {
        const createdPayments: Payment[] = [];
        inputs.forEach(input => {
            const newPayment = this.create(input); // Reuse the create method
            createdPayments.push(newPayment);
        });
        return createdPayments; // Return the array of created payments
    }

    // Delete a payment by ID
    delete(id: number): Payment {
        const paymentIndex = this.payments.findIndex(payment => payment.id === id);
        if (paymentIndex === -1) {
            throw new NotFoundException(`Payment with ID ${id} not found`);
        }
        const [deletedPayment] = this.payments.splice(paymentIndex, 1); // Remove the payment from the array
        return deletedPayment; // Return the deleted payment
    }

    // Delete multiple payments by IDs
    deleteMultiple(ids: string[]): Payment[] {
        const deletedPayments: Payment[] = [];
        ids.forEach(id => {
            const paymentId = parseInt(id, 10); // Convert string ID to number
            const paymentIndex = this.payments.findIndex(payment => payment.id === paymentId);
            if (paymentIndex !== -1) {
                const [deletedPayment] = this.payments.splice(paymentIndex, 1); // Remove the payment from the array
                deletedPayments.push(deletedPayment); // Add to the deleted payments array
            }
        });

        if (deletedPayments.length === 0) {
            throw new NotFoundException(`No payments found for the provided IDs`);
        }

        return deletedPayments; // Return the array of deleted payments
    }

    // Create a payment job
    async createPaymentJob(input: CreatePaymentInput) {
        // Add the job to the queue
        await this.jobQueue.add({ input });
    }
}