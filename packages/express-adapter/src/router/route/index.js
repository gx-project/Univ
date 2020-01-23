import callAdaptLayer from "./call";

export default function routeRegistry(
  Univ,
  parent,
  { method, url, controller }
) {
  const handler =
    typeof controller === "function" ? controller : controller.controller;
  method = method.toLowerCase();

  return parent[method](url, callAdaptLayer(Univ, handler));
}
