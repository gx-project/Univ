"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = requestAdapter;

var _busboy = _interopRequireDefault(require("busboy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function requestAdapter(request) {
  return {
    body: request.body,
    query: request.query,
    params: request.params,
    ip: request.ip,
    ips: request.ips,
    headers: request.headers,
    busboy: function UnivFastifyBusboy(options = {}) {
      const busboy = new _busboy.default({
        headers: request.headers,
        ...options
      });
      request.raw.pipe(busboy);
      return busboy;
    } // debugable?:

  };
}

module.exports = exports.default;