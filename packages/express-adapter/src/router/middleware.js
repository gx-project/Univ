import callAdaptLayer from "./call";

export default function middlewareRegistry(Univ, parent, controller) {
  parent.use(async (req, res, next) => {
    await callAdaptLayer(Univ, controller)(req, res);
    if (!res.headersSent) next();
  });
}
