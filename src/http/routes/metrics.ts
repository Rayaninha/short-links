import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { redis } from "../../lib/redis";

const metricSchema = z.object({
    shortLinkId: z.number(),
    clicks: z.number(),
});

const responseSchema = z.object({
    metrics: z.array(metricSchema)
});

export async function metrics(app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .get('/api/metrics',
        {
            schema: {
                tags: ['Metrics'],
                summary: 'Show the metrics',
                response: {
                    201: responseSchema,
                    500: z.object({
                        message: z.string()
                    })
                }
            }
        }, 
        async (request, reply) => {
            const result = await redis.zRangeByScoreWithScores("metrics", 0, 50);

            console.log(result)

            const metrics = result
            .sort((a, b) => b.score - a.score)
            .map((item) => {
                return {
                    shortLinkId: Number(item.value),
                    clicks: item.score,
                }
            })
        
            return reply.status(200).send({ metrics });
        }
    )
}