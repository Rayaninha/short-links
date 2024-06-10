import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
    NODE_ENV: z.union([
        z.literal('dev'),
        z.literal('production'),
        z.literal('test'),
    ]).default('dev'),
    PORT: z.coerce.number().default(3333),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_DB: z.string(),
    REDIS_PASSWORD: z.string(),
    POSTGRES_PORT: z.coerce.number(),
    REDIS_PORT: z.coerce.number(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    console.error('Invalid environment variables.', _env.error.format())

    throw new Error('Invalid environment variables.')
}

export const env = _env.data