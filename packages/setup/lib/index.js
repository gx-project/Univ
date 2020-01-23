"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = UnivBootstrap;

var _layer = _interopRequireDefault(require("./layer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function UnivBootstrap(adapter, builder) {
  if (!adapter) {
    throw new Error("You need specify a framework adapter");
  }

  const setupLayer = (0, _layer.default)(adapter);
  builder && builder(setupLayer);
  return setupLayer;
}

module.exports = exports.default;