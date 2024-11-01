// src/repositories/price.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Price } from '../entities/price.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PriceRepository {
  constructor(
    @InjectRepository(Price)
    private readonly repository: Repository<Price>,
  ) {}

  async savePrice(chain: string, price: number) {
    const newPrice = this.repository.create({ chain, price });
    await this.repository.save(newPrice);
  }

  async getHourlyPrices(chain: string, numberOfHour: number) {
    const twentyFourHoursAgo = new Date(
      Date.now() - numberOfHour * 60 * 60 * 1000,
    );
    return this.repository.find({
      where: { chain, createdAt: LessThanOrEqual(twentyFourHoursAgo) },
      order: { createdAt: 'DESC' },
    });
  }
}
