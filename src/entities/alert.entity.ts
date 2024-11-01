// src/entities/alert.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain: string;

  @Column({ name: 'target_price', type: 'decimal' })
  targetPrice: number;

  @Column()
  email: string;

  @Column({ name: 'is_sent', default: false })
  isSent?: boolean;
}
