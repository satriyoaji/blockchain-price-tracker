// src/dtos/alert.dtos.ts
export class AlertDto {
  chain: 'ethereum' | 'polygon';
  dollar: number; // Target price
  email: string;  // Email to notify
}
