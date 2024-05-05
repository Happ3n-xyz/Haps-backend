import dotenv from 'dotenv';
dotenv.config();

interface Config {
  env: string;
  port: number;
  dbUser: string;
  dbPassword: string;
  dbHost: string;
  dbName: string;
  dbPort: string;
  jwtSecret: string;
  google_client_id: string;
  google_client_secret: string;
  pk: string;
  contractAddress: string;
  rpcUrl: string;
}

const config: Config = {
  env: process.env.NODE_ENV || 'dev',
  port: parseInt(process.env.PORT || '3001', 10),
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD || 'postgres',
  dbHost: process.env.DB_HOST || 'localhost',
  dbName: process.env.DB_NAME || 'postgres',
  dbPort: process.env.DB_PORT || '5432',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  google_client_id: process.env.GOOGLE_CLIENT_ID || '',
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
  pk: process.env.PK || '',
  contractAddress: process.env.CONTRACT_ADDRESS || '',
  rpcUrl: process.env.RPC_URL || ''
}

export { config };

