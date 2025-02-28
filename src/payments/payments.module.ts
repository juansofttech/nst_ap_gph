import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { JobProcessor } from '../utils/job.processor'; // Import the generic processor
import { PaymentsResolver } from './payments.resolver';
import { PaymentsService } from './payments.service';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'generic', 
        }),
    ],
    providers: [PaymentsService, PaymentsResolver, JobProcessor],
})
export class PaymentsModule { }