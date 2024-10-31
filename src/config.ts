// src/config.ts
import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  moralisApiKey: process.env.MORALIS_API_KEY,
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
};
