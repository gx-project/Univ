"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeFastifyServer;

var _fastify = _interopRequireDefault(require("fastify"));

var _fastifyHelmet = _interopRequireDefault(require("fastify-helmet"));

var _fastifyCookie = _interopRequireDefault(require("fastify-cookie"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeFastifyServer(configs) {
  const {
    middlewares: {
      helmet = true
    } = {},
    port,
    cookies,
    ...instanceConfig
  } = configs;
  const instance = (0, _fastify.default)(instanceConfig);
  helmet && instance.register(_fastifyHelmet.default, helmet !== true ? { ...helmet
  } : {});

  if (cookies) {
    const {
      secret,
      ...parseOptions
    } = cookies;
    instance.register(_fastifyCookie.default, {
      secret,
      parseOptions
    });
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

module.exports = exports.default;