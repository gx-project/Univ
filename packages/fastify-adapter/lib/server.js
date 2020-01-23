"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeFastifyServer;

var _fastify = _interopRequireDefault(require("fastify"));

var _fastifyHelmet = _interopRequireDefault(require("fastify-helmet"));

var _fastifyFormbody = _interopRequireDefault(require("fastify-formbody"));

var _fastifyMultipart = _interopRequireDefault(require("fastify-multipart"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeFastifyServer({
  middlewares: {
    helmet = true,
    formBody = true,
    multiPart = true
  } = {},
  port,
  ...config
} = {}) {
  return function configureServer() {
    const instance = (0, _fastify.default)(config || {});
    helmet && instance.register(_fastifyHelmet.default, helmet !== true ? { ...helmet
    } : {});
    formBody && instance.register(_fastifyFormbody.default, formBody !== true ? { ...formBody
    } : {});
    multiPart && instance.register(_fastifyMultipart.default, multiPart !== true ? {
      addToBody: true,
      ...multiPart
    } : {});
    return {
      instance,

      decorator(key, value) {
        instance.decorate(key, value);
      },

      async start() {
        await instance.listen(port);
      }

    };
  };
}

module.exports = exports.default;