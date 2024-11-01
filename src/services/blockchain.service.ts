// src/services/blockchain.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
// import { lastValueFrom } from 'rxjs';
import { PriceRepository } from '../repositories/price.repository';
import { AlertRepository } from '../repositories/alert.repository';
import { sendAlertEmail } from '../helpers/email.helper';
import { AlertDto } from '../dtos/alert.dto';
import Moralis from 'moralis';

@Injectable()
export class BlockchainService implements OnModuleInit {
  // private moralisApiKey: string;
  private ethereumAddress: string;
  private polygonAddress: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly priceRepository: PriceRepository,
    private readonly alertRepository: AlertRepository,
    private readonly httpService: HttpService,
  ) {
    // this.moralisApiKey = this.configService.get<string>('MORALIS_API_KEY');
    this.ethereumAddress = this.configService.get<string>(
      'ETHEREUM_TOKEN_ADDRESS',
    );
    this.polygonAddress = this.configService.get<string>(
      'POLYGON_TOKEN_ADDRESS',
    );
  }

  async onModuleInit() {
    // Initialize Moralis with the API key
    await Moralis.start({
      apiKey: this.configService.get<string>('MORALIS_API_KEY'),
    });
  }

  async fetchAndSavePrice(chain: string) {
    if (chain !== 'ethereum' && chain !== 'polygon') {
      throw new Error(`${chain} is not recognized.`);
    }
    const address =
      chain === 'ethereum' ? this.ethereumAddress : this.polygonAddress;
    if (!address) {
      throw new Error(`${chain} address not configured.`);
    }
    const chainId = chain === 'ethereum' ? '0x1' : '0x89'; // Ethereum or Polygon chain IDs

    // const response = await Moralis.EvmApi.balance.getNativeBalance({
    //   address: address,
    //   chain: chainId
    // });
    const response = await Moralis.EvmApi.token.getTokenPrice({
      chain: chainId,
      address: address,
      include: 'percent_change',
    });
    console.log('API: ', chainId, address, response.raw);
    const currentPrice = response.raw.usdPrice;

    await this.priceRepository.savePrice(chain, currentPrice);

    const priceRecordAnHourAgo = await this.priceRepository.getHourlyPrices(
      chain,
      1,
    );
    if (!priceRecordAnHourAgo) return;
    for (const priceRecord of priceRecordAnHourAgo) {
      if (priceRecord.price > (currentPrice  * 1.03)){
        // create Alert
        const alertDto: AlertDto = {
          chain: chain === 'ethereum' ? 'ethereum' : 'polygon',
          email: this.configService.get<string>('EMAIL_DESTINATION'),
          dollar: priceRecord.price,
        };

        // send email
        const emailResult = await sendAlertEmail(
          alertDto.email,
          alertDto.chain,
          alertDto.dollar,
        );
        if (emailResult.success) {
          console.log(emailResult.message);

          this.alertRepository.saveAlert(
            alertDto.chain,
            alertDto.dollar,
            alertDto.email,
            true,
          );
        } else {
          // Failed to send email
          console.error(emailResult.message);

          this.alertRepository.saveAlert(
            alertDto.chain,
            alertDto.dollar,
            alertDto.email,
            false,
          );
        }
      }
    }
  }

  // this method will automatically Notify via Email if any Alert data that not sent yet
  async alertEmail(chain: string) {
    // Check and send alert if applicable
    const alertsNotSentYet = await this.alertRepository.findAlertsNotSentYet(chain);
    for (const alert of alertsNotSentYet) {
      const emailResult = await sendAlertEmail(
        alert.email,
        chain,
        alert.targetPrice,
      );
      if (emailResult.success) {
        console.log(emailResult.message);
        await this.alertRepository.updateIsSentById(alert.id, true);
      } else {
        console.error(emailResult.message);
        // Handle failure, like retrying or logging
      }
    }
  }

  // Method to retrieve hourly prices for the past 24 hours
  async getHourlyPrices(chain: string) {
    return this.priceRepository.getHourlyPrices(chain, 24);
  }

  // Method to create a new price alert
  async createAlert(alertDto: AlertDto) {
    return this.alertRepository.saveAlert(
      alertDto.chain,
      alertDto.dollar,
      alertDto.email,
      false,
    );
  }

  // Method to calculate ETH to BTC swap rate and fee
  async calculateSwapRate(ethAmount: number) {
    const ethToBtcRate = await this.fetchEthToBtcRate();
    const btcEquivalent = ethAmount * ethToBtcRate;
    const fee = ethAmount * 0.03; // 3% fee

    return {
      btcEquivalent,
      feeInEth: fee,
      feeInUsd: fee * (await this.fetchEthPriceInUsd()),
    };
  }

  private async fetchEthToBtcRate(): Promise<number> {
    // Here we can use Web3 provider to fetch the current rate, but need the BTC Contract Address too
    return 0.055; // Placeholder value for ETH to BTC rate
  }

  private async fetchEthPriceInUsd(): Promise<number> {
    // Example function to fetch the ETH price in USD
    const response = await Moralis.EvmApi.token.getTokenPrice({
      chain: '0x1',
      address: this.ethereumAddress,
    });
    return response.raw.usdPrice;
  }
}
