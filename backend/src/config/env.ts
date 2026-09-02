import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Try multiple candidate paths for .env
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../.env'),
];

for (const p of envPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}
dotenv.config();

export const config = {
  get port(): number {
    return parseInt(process.env.PORT || '5000', 10);
  },
  get nodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  },
  get geoapifyApiKey(): string {
    return process.env.GEOAPIFY_API_KEY || '';
  },
  get isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  },
  defaultSearchRadius: 5000, // 5km default
  maxResultsCount: 5,
};
