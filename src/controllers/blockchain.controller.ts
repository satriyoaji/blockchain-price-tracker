// src/controllers/blockchain.controller.ts
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { BlockchainService } from '../services/blockchain.service';
import { AlertDto } from '../dtos/alert.dto';
import { SwapRateDto } from '../dtos/swap-rate.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  /**
   * Returns the hourly prices for the past 24 hours for the specified blockchain.
   *
   * @param chain - Blockchain type (e.g., 'ethereum' or 'polygon')
   */
  @Get('/prices')
  @ApiOperation({ summary: 'Get hourly prices for the past 24 hours' })
  @ApiQuery({ name: 'chain', required: true, description: 'Blockchain type (e.g., ethereum or polygon)' })
  @ApiResponse({ status: 200, description: 'Returns hourly prices for the past 24 hours.' })
  async getHourlyPrices(@Query('chain') chain: string) {
    return this.blockchainService.getHourlyPrices(chain);
  }

  /**
   * Sets a price alert for a specific chain and target price.
   *
   * @param alertDto - Alert settings including chain, target price, and recipient email
   */
  @Post('/alert')
  @ApiOperation({ summary: 'Set a price alert for a specific chain and target price' })
  @ApiBody({ type: AlertDto, description: 'Alert settings for chain, price, and email' })
  @ApiResponse({ status: 201, description: 'Alert successfully set.' })
  async setAlert(@Body() alertDto: AlertDto) {
    return this.blockchainService.createAlert(alertDto);
  }

  /**
   * Gets the ETH to BTC swap rate based on the inputted ETH amount.
   *
   * @param swapRateDto - Contains the amount of ETH to convert
   */
  @Post('/swap-rate')
  @ApiOperation({ summary: 'Get ETH to BTC swap rate based on inputted ETH amount' })
  @ApiBody({ type: SwapRateDto, description: 'Amount of ETH for conversion' })
  @ApiResponse({ status: 200, description: 'Returns the equivalent BTC amount and fee details.' })
  async getSwapRate(@Body() swapRateDto: SwapRateDto) {
    return this.blockchainService.calculateSwapRate(swapRateDto.amount);
  }
}
