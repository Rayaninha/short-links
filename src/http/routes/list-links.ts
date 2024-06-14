import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { sql } from "../../lib/postgres";

const linkSchema = z.object({
    id: z.string().uuid(),
    code: z.string(),
    origin_url: z.string().url(),
    created_at: z.date()
});

const responseSchema = z.object({
    links: z.array(linkSchema)
});

export async function listLinks(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .get('/api/links',
        {
            schema: {
                tags: ['Link'],
                summary: 'List links',
                response: {
                    201: responseSchema,
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

            const result = await sql/* sql */ `
                SELECT *
                FROM short_links
                ORDER BY created_at DESC`;

            const parsedResult = responseSchema.parse({ links: result });
        
            return reply.status(200).send(parsedResult);
        }
    )
}