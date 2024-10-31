// src/repositories/alert.repository.ts
import { Injectable } from '@nestjs/common';
import {LessThanOrEqual, Repository} from 'typeorm';
import { Alert } from '../entities/alert.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AlertDto } from '../dtos/alert.dto';

@Injectable()
export class AlertRepository {
  constructor(
    @InjectRepository(Alert)
    private readonly repository: Repository<Alert>,
  ) {}

  async createAlert(alertDto: AlertDto) {
    const newAlert = this.repository.create(alertDto);
    return await this.repository.save(newAlert);
  }

  async findAlertsForChain(chain: string) {
    return this.repository.find({ where: { chain } });
  }

  async findAlerts(chain: string, currentPrice: number) {
    return this.repository.find({ where: { chain, target_price: LessThanOrEqual(currentPrice) } });
  }

  async saveAlert(chain: string, targetPrice: number, email: string) {
    const newAlert = this.repository.create({ chain, target_price: targetPrice, email });
    await this.repository.save(newAlert);
  }
}
