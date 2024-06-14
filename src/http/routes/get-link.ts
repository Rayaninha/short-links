import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { sql } from "../../lib/postgres";
import { redis } from "../../lib/redis";

export async function getLink(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .get('/:code',
        {
            schema: {
                tags: ['Link'],
                summary: 'get link',
                params: z.object({
                    code: z.string().min(3)
                }),
                response: {
                    301: z.object({
                        message: z.string().optional()
                    }),
                    400: z.object({
                        message: z.string()
                    }),
                    500: z.object({
                        message: z.string()
                    })
                }
            }
        }, 
        async (request, reply) => {
            const { code } = request.params

            const result = await sql/* sql */ `
                SELECT id, origin_url
                FROM short_links
                WHERE short_links.code = ${code}
            `;

            if(result.length === 0) {
                return reply.status(400).send({
                    message: "Link not found."
                })
            }
        
            const link = result[0]

            await redis.zIncrBy("metrics", 1, String(link.id))

            return reply.redirect(301, link.origin_url)
        }
    )
}