// src/repositories/alert.repository.ts
import { Injectable } from '@nestjs/common';
import {FindOneOptions, LessThanOrEqual, Repository} from 'typeorm';
import { Alert } from '../entities/alert.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AlertRepository {
  constructor(
    @InjectRepository(Alert)
    private readonly repository: Repository<Alert>,
  ) {}

  async findAlertsNotSentYet(chain: string) {
    return this.repository.find({ where: { chain, isSent: false } });
  }

  async findAlertsLTEPrice(chain: string, currentPrice: number) {
    return this.repository.find({ where: { chain, targetPrice: LessThanOrEqual(currentPrice) } });
  }

  async saveAlert(
    chain: string,
    targetPrice: number,
    email: string,
    isSent: boolean,
  ) {
    const newAlert = this.repository.create({ chain, targetPrice: targetPrice, email, isSent });
    await this.repository.save(newAlert);
  }

  async updateIsSentById(id: number, isSent: boolean): Promise<void> {
    await this.repository.update(id, { isSent });
  }
}
