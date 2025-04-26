// corsHandler.ts
import { cors } from 'hono/cors';

export const corsHandler = cors({
  origin: '*',
  allowHeaders: ['Authorization', 'Content-Type'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});
