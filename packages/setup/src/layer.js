import routerWrapper from "./routerWrapper";
import { kAdapter, kServer } from "./symbols";

export default function SetupLayer(adapter) {
  const internal = {};

  internal[kAdapter] = adapter;
  internal[kServer] = adapter.Server();

  internal.engine = adapter.engine;
  internal.adapterVersion = adapter.version;

  internal.fwInstance = internal[kServer].instance;
  // internal[kRouter] = ;

  const _public = {
    fwInstance: internal.fwInstance,
    async start(callback) {
      const server = await internal[kServer].start();
      callback && callback(server);
      _public.server = server;
      return server;
    },
    async close(callback) {
      await internal[kServer].close();
      callback && callback();
    },
    ...routerWrapper(internal, internal[kServer].startRoutingPoint)
  };

  _public.attach = function attach(key, value) {
    throwIfReserverdOrAlreadyDeclaredKey(key, _public);

    _public[String(key)] = value;
  };
  return _public;
}

const reservedKeys = [
  "fwInstance",
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
