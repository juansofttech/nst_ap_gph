import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('generic') // Use a generic name for the queue
export class JobProcessor {
    @Process()
    async handleJob(job: Job) {
        console.log('Processing job:', job.data);
        // Implement your job processing logic here
    }
}