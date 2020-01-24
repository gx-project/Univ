import routerWrapper from "./routerWrapper";
import { kAdapter, kServer } from "./symbols";

export default class SetupLayer {
  constructor(adapter) {
    this[kAdapter] = adapter;
    this[kServer] = adapter.Server();

    this.engine = adapter.engine;
    this.adapterVersion = adapter.version;

    this.fwInstance = this[kServer].instance;

    const initialRouter = routerWrapper(this, this[kServer].startRoutingPoint);

    this.endpoint = initialRouter.endpoint;
    this.get = initialRouter.get;
    this.post = initialRouter.post;
    this.put = initialRouter.put;
    this.delete = initialRouter.delete;
    this.options = initialRouter.options;
    this.head = initialRouter.head;
    this.patch = initialRouter.patch;
  }

  setErrorTracker(handler) {
    this.errorTracker = handler;
  }

  attach(key, value) {
    throwIfReserverdOrAlreadyDeclaredKey(key, this);

    this[String(key)] = value;
  }

  async start(callback) {
    const server = await this[kServer].start();
    callback && callback(server);
    this.server = server;
    return server;
  }

  async close(callback) {
    await this[kServer].close();
    callback && callback();
  }
}

const reservedKeys = [
  "fwInstance",
  "engine",
  "adapterVersion",
  "setErrorTracker",
  "errorTracker",
  "server",
  "start",
  "close",
  "attach",
  "endpoint",
  "get",
  "post",
  "put",
  "delete",
  "options",
  "head",
  "patch"
];

function throwIfReserverdOrAlreadyDeclaredKey(key, keys) {
  if (reservedKeys.indexOf(key) !== -1)
    throw new TypeError(
      `You can't use a reserved property name "${key}" to instance`
    );

  if (Object.prototype.hasOwnProperty.call(keys, key)) {
    throw new TypeError(
      `You already declared the property name "${key}" to instance`
    );
  }
}
