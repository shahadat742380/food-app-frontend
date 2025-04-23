import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { env } from '@/config/env';

export const auth = betterAuth({
  baseURL: `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth`,
  plugins: [nextCookies()],
});
