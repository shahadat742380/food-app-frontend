import axios from 'axios';
import { env } from './env';

export const Axios = axios.create({
  baseURL:
    env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8787',
    withCredentials: true,
});
