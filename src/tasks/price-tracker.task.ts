// src/tasks/price-tracker.task.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BlockchainService } from '../services/blockchain.service';

@Injectable()
export class PriceTrackerTask {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Cron('*/5 * * * *')
  async handlePriceTracking() {
    await this.blockchainService.savePrice('ethereum');
    await this.blockchainService.savePrice('polygon');
  }
}
