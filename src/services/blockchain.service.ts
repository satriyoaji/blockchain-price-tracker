// src/services/blockchain.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { PriceRepository } from '../repositories/price.repository';
import { AlertRepository } from '../repositories/alert.repository';
import { sendAlertEmail } from '../helpers/email.helper';
import { AlertDto } from '../dto/alert.dto';

@Injectable()
export class BlockchainService {
  private moralisApiKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly priceRepository: PriceRepository,
    private readonly alertRepository: AlertRepository,
    private readonly httpService: HttpService,
  ) {
    this.moralisApiKey = this.configService.get<string>('MORALIS_API_KEY');
  }

  async createAlert(alertDto: AlertDto) {
    return this.alertRepository.createAlert(alertDto);
  }

  async fetchPrice(chain: string): Promise<number> {
    const response = await lastValueFrom(
      this.httpService.get(`https://api.moralis.io/v2/${chain}/price`, {
        headers: { 'X-API-Key': this.moralisApiKey },
      }),
    );
    return response.data.price;
  }

  async savePrice(chain: string) {
    const price = await this.fetchPrice(chain);
    await this.priceRepository.savePrice(chain, price);
    this.checkAlerts(chain, price);
  }

  async checkAlerts(chain: string, price: number) {
    const alerts = await this.alertRepository.findAlertsForChain(chain);
    alerts.forEach(async (alert) => {
      if (price >= alert.alertPrice) {
        await sendAlertEmail(alert.email, chain, price);
      }
    });
  }

  async getHourlyPrices(chain: string) {
    return this.priceRepository.getHourlyPrices(chain);
  }
}
