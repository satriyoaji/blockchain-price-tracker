// src/tasks/price-tracker.task.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BlockchainService } from '../services/blockchain.service';

@Injectable()
export class PriceTrackerTask {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Cron('* * * * *') // Runs every 5 minutes
  async handlePriceTracking() {
    await this.blockchainService.fetchAndSavePrice('ethereum');
    await this.blockchainService.fetchAndSavePrice('polygon');

    await this.blockchainService.alertEmail('ethereum');
    await this.blockchainService.alertEmail('polygon');

  }
}
