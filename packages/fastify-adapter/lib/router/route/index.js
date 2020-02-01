"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = routeRegistry;

var _call = _interopRequireDefault(require("./call"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function routeRegistry(Univ, parent, {
  method,
  url,
  controller
}) {
  const handler = typeof controller === "function" ? controller : controller.controller;
  parent.route({
    method,
    url,
    handler: (0, _call.default)(Univ, handler)
  });
}

module.exports = exports.default;