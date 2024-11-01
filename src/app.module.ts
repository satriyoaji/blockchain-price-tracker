// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { BlockchainController } from './controllers/blockchain.controller';
import { BlockchainService } from './services/blockchain.service';
import { PriceTrackerTask } from './tasks/price-tracker.task';
import { Price } from './entities/price.entity';
import { Alert } from './entities/alert.entity';
import { PriceRepository } from './repositories/price.repository';
import { AlertRepository } from './repositories/alert.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Price, Alert],
        synchronize: true,
        retryAttempts: 5,    // Retry up to 5 times
        retryDelay: 2000,    // Wait 3 seconds between retries
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Price, Alert]),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  controllers: [BlockchainController],
  providers: [
    BlockchainService,
    PriceTrackerTask,
    PriceRepository,
    AlertRepository,
  ],
})
export class AppModule {}
