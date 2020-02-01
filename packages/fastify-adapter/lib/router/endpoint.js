"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = endpointRegistry;

function endpointRegistry(Univ, {
  parent,
  url
}, callback) {
  return parent.register(function (endpoint, opts, done) {
    callback(endpoint, Univ);
    done();
  }, {
    prefix: url
  });
}

module.exports = exports.default;