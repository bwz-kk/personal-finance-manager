import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  HOST: z.string().default('127.0.0.1'),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
})

export const env = envSchema.parse(process.env)
