import express, { urlencoded, Router } from "express";
import Helmet from "helmet";
import cookieParser from "cookie-parser";

export default function makeExpressServer(configs = {}) {
  return function configureServer() {
    const {
      middlewares: { helmet = true } = {},
      port,
      cookies,
      ...instanceConfig
    } = configs;

    const instance = express(instanceConfig);

    helmet &&
      instance.use(
        Helmet(
          helmet !== true
            ? {
                ...helmet
              }
            : {}
        )
      );

    instance.use(urlencoded({ extended: true }));

    if (cookies) {
      const { secret, ...parseOptions } = cookies;
      instance.use(cookieParser(secret, parseOptions));
    }

    let server;
    const startRoutingPoint = Router();

    instance.use("/", startRoutingPoint);

    return {
      configs,
      instance,
      startRoutingPoint,
      start() {
        server = instance.listen(port);

        return Promise.resolve(server.address());
      },
      close: () => {
        server.close();
        return Promise.resolve();
      }
    };
  };
}
