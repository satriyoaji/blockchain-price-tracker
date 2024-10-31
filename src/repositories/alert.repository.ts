// src/repositories/alert.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Alert } from '../entities/alert.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {AlertDto} from "../dto/alert.dto";

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

  async saveAlert(chain: string, alertPrice: number, email: string) {
    const newAlert = this.repository.create({ chain, alertPrice, email });
    await this.repository.save(newAlert);
  }
}
