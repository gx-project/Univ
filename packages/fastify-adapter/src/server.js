import fastify from "fastify";
import fastifyHelmet from "fastify-helmet";

export default function makeFastifyServer(configs = {}) {
  return function configureServer() {
    const {
      middlewares: { helmet = true } = {},
      port,
      ...instanceConfig
    } = configs;

    const instance = fastify(instanceConfig);

    helmet &&
      instance.register(
        fastifyHelmet,
        helmet !== true
          ? {
              ...helmet
            }
          : {}
      );

    instance.addContentTypeParser("multipart", (req, done) => {
      done();
    });
    // instance.register(fastifyMultipart);

    return {
      configs,
      instance,
      startRoutingPoint: instance,
      async start() {
        await instance.listen(port);
        return instance.server.address();
      },
      close: instance.close
    };
  };
}
