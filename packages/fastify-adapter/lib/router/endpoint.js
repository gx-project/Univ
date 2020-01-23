"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = endpointRegistry;

function endpointRegistry(parent, url, callback) {
  return parent.register(function (endpoint, opts, done) {
    callback(endpoint);
    done();
  }, {
    prefix: url
  });
}

module.exports = exports.default;