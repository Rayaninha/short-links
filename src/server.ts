import fastify from "fastify";
import { env } from "./env";
import { ZodTypeProvider, jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { createLink } from "./http/routes/create-link";
import { listLinks } from "./http/routes/list-links";
import { getLink } from "./http/routes/get-link";
import { metrics } from "./http/routes/metrics";

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifySwagger, {
    openapi: {
        info:{
            title: 'Short Links',
            version: '1.0.0'
        },
    },
    transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, {
    routePrefix: '/docs'
})

app.register(createLink)
app.register(listLinks)
app.register(getLink)
app.register(metrics)

app.listen({
    port: env.PORT
}).then(() => {
    console.log("HTTP server running!")
})