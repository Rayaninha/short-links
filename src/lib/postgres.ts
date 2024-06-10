import postgres from "postgres";
import { env } from "../env";

export const sql = postgres(
    `postgresql://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@localhost:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`
);