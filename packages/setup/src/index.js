import setupLayer from "./layer";
/**
 * A Univ adapter.
 * @typedef { Object } UnivAdapter
 */

/**
 * @param { UnivAdapter } adapter
 */
export default function UnivBootstrap(adapter, builder) {
  if (!adapter) {
    throw new Error("You need specify a framework adapter");
  }

  checkAdapter(adapter);

  const layer = setupLayer(adapter);
  builder && builder(layer);

  return layer;
}

function checkAdapter(adapter) {
  if (
    typeof adapter !== "object" ||
    !adapter.engine ||
    !adapter.version ||
    (adapter.Router && (!adapter.Router.Endpoint || !adapter.Router.Route)) ||
    !adapter.Server
  )
    throw new Error("This adapter is invalid");
}
