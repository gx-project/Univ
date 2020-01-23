"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = requestAdapter;

function requestAdapter(request) {
  return {
    raw: request,
    body: request.body,
    query: request.query,
    params: request.params,
    ip: request.ip || request.ips[request.ips.length - 1],
    headers: request.headers
  };
}

module.exports = exports.default;