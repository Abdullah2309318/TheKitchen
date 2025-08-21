import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { IngestService } from './ingest.service';

@Controller('ingest') // This controller handles requests to the /ingest path
export class IngestController {
  constructor(private readonly ingestService: IngestService) {}

  @Post('drivers') // This method handles POST requests to /ingest/drivers
  @HttpCode(HttpStatus.ACCEPTED) // Returns 202 to indicate the process has started
  triggerDriverIngestion() {
    // We start the process but don't wait for it to finish
    this.ingestService.ingestLatestDrivers();
    
    return { message: 'Driver ingestion process has been started.' };
  }
}