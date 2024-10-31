// src/controllers/blockchain.controller.ts
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { BlockchainService } from '../services/blockchain.service';
import { AlertDto } from '../dtos/alert.dto';
import { SwapRateDto } from '../dtos/swap-rate.dto';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  // 1. Return hourly prices for the past 24 hours
  @Get('/prices')
  async getHourlyPrices(@Query('chain') chain: string) {
    return this.blockchainService.getHourlyPrices(chain);
  }

  // 2. Set a price alert for a specific chain and target price
  @Post('/alert')
  async setAlert(@Body() alertDto: AlertDto) {
    return this.blockchainService.createAlert(alertDto);
  }

  // 3. Get ETH to BTC swap rate based on inputted ETH amount
  @Post('/swap-rate')
  async getSwapRate(@Body() swapRateDto: SwapRateDto) {
    return this.blockchainService.calculateSwapRate(swapRateDto.amount);
  }
}
