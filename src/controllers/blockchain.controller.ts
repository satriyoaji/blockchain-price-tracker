// src/controllers/blockchain.controller.ts
import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { BlockchainService } from '../services/blockchain.service';
import { AlertDto } from '../dto/alert.dto';

@Controller('api/blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('prices')
  async getPrices(@Query('chain') chain: string) {
    return this.blockchainService.getHourlyPrices(chain);
  }

  @Post('alert')
  async setAlert(@Body() alertDto: AlertDto) {
    return this.blockchainService.createAlert(alertDto);
  }
}
