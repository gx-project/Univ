import callAdaptLayer from "./call";

export default function routeRegistry(
  Univ,
  parent,
  { method, url, controller }
) {
  const handler =
    typeof controller === "function" ? controller : controller.controller;

  parent.route({
    method,
    url,
    handler: callAdaptLayer(Univ, handler)
  });
}
