import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    orderId: string;

    @Column('decimal')
    amount: number;

    @Column()
    method: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}