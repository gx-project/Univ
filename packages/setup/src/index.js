import routerWrapper from "./routerWrapper";

const reservedKeys = [
  "adapter",
  "setErrorTracker",
  "errorTracker",
  "server",
  "start",
  "close",
  "attach",
  "use",
  "endpoint",
  "get",
  "post",
  "put",
  "delete",
  "options",
  "head",
  "patch"
];

export default class UnivSetupLayer {
  constructor(adapter, config = {}) {
    throwIfInvalidAdapter(adapter);

    this.adapter = adapter;

    this.server = adapter.Server(config);

    const initialRouter = routerWrapper(this, this.server.startRoutingPoint);

    this.use = initialRouter.use;
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
    key = String(key);
    throwIfReserverdOrAlreadyDeclaredKey(key, this);

    if (typeof value === "function") {
      this[key] = value(this);
      return;
    }

    this[key] = value;
  }

  async start(callback) {
    const server = await this.server.start();
    callback && callback(server);
    this.server.info = server;
    return server;
  }

  async close(callback) {
    await this.server.close();
    callback && callback();
  }
}

function throwIfInvalidAdapter(adapter) {
  if (
    !adapter ||
    typeof adapter !== "object" ||
    !adapter.engine ||
    !adapter.version ||
    (adapter.Router && (!adapter.Router.Endpoint || !adapter.Router.Route)) ||
    !adapter.Server
  )
    throw new Error("Invalid adapter");
}

function throwIfReserverdOrAlreadyDeclaredKey(key, on) {
  if (reservedKeys.indexOf(key) !== -1)
    throw new TypeError(
      `You can't attach a reserved property name "${key}" to instance`
    );

  if (Object.prototype.hasOwnProperty.call(on, key)) {
    throw new TypeError(
      `You already attached the property name "${key}" to instance`
    );
  }
}
