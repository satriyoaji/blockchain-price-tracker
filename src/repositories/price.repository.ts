// src/repositories/price.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository, MoreThanOrEqual } from 'typeorm';
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

  async getHourlyPrices(chain: string) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.repository.find({
      where: { chain, createdAt: MoreThanOrEqual(twentyFourHoursAgo) },
      order: { createdAt: 'DESC' },
    });
  }
}
