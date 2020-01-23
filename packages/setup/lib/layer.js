"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = UnivSetupLayer;

var _routerWrapper = _interopRequireDefault(require("./routerWrapper"));

var _symbols = require("./symbols");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function UnivSetupLayer(adapter) {
  this[_symbols.kAdapter] = adapter;
  this[_symbols.kServer] = adapter.Server();
  this.fwInstance = this[_symbols.kServer].instance; // internal[kRouter] = ;

  const _public = {
    fwInstance: this.fwInstance,
    ...(0, _routerWrapper.default)(this, this.fwInstance)
  };

  _public.attach = function attach(key, value) {
    if (this[_symbols.kServer].decorator) {
      return this[_symbols.kServer].decorator(key, value);
    }

    throwIfReserverdOrAlreadyDecalredKey(key, _public);
    _public[String(key)] = value;
  };

  return _public;
}
/*
export default class UnivWorkLayer {
  constructor(adapter) {
    this[kAdapter] = adapter;
    this[kServer] = adapter.Server(this);
    this.fwInstance = this[kServer].instance;

    this[kRouter] = routerWrapper(this);

    this.endpoint = this[kRouter].endpoint;
    this.get = this[kRouter].get;
    this.post = this[kRouter].post;
    this.put = this[kRouter].put;
    this.delete = this[kRouter].delete;
    this.options = this[kRouter].options;
    this.head = this[kRouter].head;
    this.path = this[kRouter].path;
  }

  start() {
    this[kServer].start();
  }

  attach(key, value) {
    if (this[kServer].decorator) {
      return this[kServer].decorator(key, value);
    }

    throwIfReserverdKey(key);

    this[String(key)] = value;
  }
}
*/


const reservedKeys = ["fwInstance", "endpoint", "get", "post", "put", "delete", "options", "head", "path", "attach", "start"];

function throwIfReserverdOrAlreadyDecalredKey(key, keys) {
  if (reservedKeys.indexOf(key) !== -1) throw new TypeError(`You can't use a reserved property name ${key} to instance`);

  if (Object.prototype.hasOwnProperty.call(keys, key)) {
    throw new TypeError(`You already declared the property name ${key} to instance`);
  }
}

module.exports = exports.default;