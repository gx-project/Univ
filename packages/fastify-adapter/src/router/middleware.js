import callAdaptLayer from "./call";

export default function middlewareRegistry(Univ, parent, controller) {
  parent.addHook("onRequest", callAdaptLayer(Univ, controller));
}
