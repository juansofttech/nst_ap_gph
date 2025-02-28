import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMultiplePaymentsInput, CreatePaymentInput, DeleteMultiplePaymentsInput } from './create-payment.input'; // Import the new input type
import { Payment } from './payment.dto';
import { PaymentsService } from './payments.service';

@Resolver(() => Payment)
export class PaymentsResolver {
    constructor(private paymentsService: PaymentsService) { }

    @Query(() => [Payment]) // Query to get all payments
    getPayments() {
        return this.paymentsService.findAll();
    }

    @Query(() => Payment, { nullable: true }) // Query to get a specific payment by ID
    getPayment(@Args('id') id: number) {
        return this.paymentsService.findOne(id);
    }

    @Mutation(() => Payment) // Mutation to create a new payment
    createPayment(@Args('input') input: CreatePaymentInput) {
        return this.paymentsService.create(input);
    }

    @Mutation(() => [Payment]) // Mutation to create multiple payments
    createMultiplePayments(@Args('createMultiplePaymentsData') createMultiplePaymentsData: CreateMultiplePaymentsInput) {
        return this.paymentsService.createMultiple(createMultiplePaymentsData.payments);
    }

    @Mutation(() => Payment) // Mutation to delete a payment by ID
    deletePayment(@Args('id') id: number): Payment {
        const deletedPayment = this.paymentsService.delete(id);
        if (!deletedPayment) {
            throw new NotFoundException(`Payment with ID ${id} not found`);
        }
        return deletedPayment;
    }

    @Mutation(() => [Payment]) // Mutation to delete multiple payments
    async deleteMultiplePayments(@Args('deleteMultiplePaymentsData') deleteMultiplePaymentsData: DeleteMultiplePaymentsInput): Promise<Payment[]> {
        const deletedPayments = await this.paymentsService.deleteMultiple(deleteMultiplePaymentsData.ids);
        if (deletedPayments.length === 0) {
            throw new NotFoundException(`No payments found for the provided IDs`);
        }
        return deletedPayments;
    }

    @Mutation(() => String) // Mutation to create a payment job
    async createPaymentJob(@Args('input') input: CreatePaymentInput) {
        await this.paymentsService.createPaymentJob(input);
        return 'Payment job created successfully';
    }
}