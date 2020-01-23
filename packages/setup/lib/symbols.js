"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kRouter = exports.kServer = exports.kAdapter = void 0;
const kAdapter = Symbol("univ.adapter");
exports.kAdapter = kAdapter;
const kServer = Symbol("univ.serverAdapter");
exports.kServer = kServer;
const kRouter = Symbol("univ.routerAdapter");
exports.kRouter = kRouter;