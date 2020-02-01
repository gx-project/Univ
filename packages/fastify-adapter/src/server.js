import fastify from "fastify";
import fastifyHelmet from "fastify-helmet";
import fastifyCookie from "fastify-cookie";

export default function makeFastifyServer(configs) {
  const {
    middlewares: { helmet = true } = {},
    port,
    cookies,
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

  if (cookies) {
    const { secret, ...parseOptions } = cookies;
    instance.register(fastifyCookie, { secret, parseOptions });
  }

  instance.addContentTypeParser("multipart", (req, done) => {
    done();
  });

  return {
    configs,
    instance,
    startRoutingPoint: instance,
    async start() {
      await instance.listen(port);
      return instance.server.address();
    },
    close: () => {
      instance.server.close();
      return Promise.resolve();
    }
  };
}
