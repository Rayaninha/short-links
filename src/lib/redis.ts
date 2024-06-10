import { createClient } from "redis";
import { env } from "../env";

export const redis = createClient({
    url: `redis://:${env.REDIS_PASSWORD}@localhost:${env.REDIS_PORT}`
});

redis.connect();