import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { sql } from "../../lib/postgres";

export async function createLink(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .post('/api/links',
        {
            schema: {
                tags: ['Link'],
                summary: 'Create link',
                body: z.object({
                    code: z.string().min(3),
                    url: z.string().url(),
                }),
                response: {
                    201: z.object({
                        shortLinkId: z.number()
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
            const { code, url } = request.body

            const result = await sql/* sql */ `
                INSERT INTO short_links (code, origin_url) 
                VALUES (${code}, ${url})
                RETURNING id`;
        
            const link = result[0];
        
            return reply.status(201).send({ shortLinkId: link.id });
        }
    )
}