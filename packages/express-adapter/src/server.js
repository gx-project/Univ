import { createServer } from "http";
import express, { urlencoded, Router } from "express";
import Helmet from "helmet";
import cookieParser from "cookie-parser";

export default function makeExpressServer(configs) {
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

  const startRoutingPoint = Router();

  instance.use("/", startRoutingPoint);
  instance.server = createServer(instance);

  return {
    configs,
    instance,
    startRoutingPoint,
    start() {
      return new Promise(resolve => {
        instance.server.listen(port, () => {
          resolve(instance.server.address());
        });
      });
    },
    close: () => {
      instance.server.close();
      return Promise.resolve();
    }
  };
}
