import createContext from "./context";

export default function callAdaptLayer(Univ, controller) {
  return async function(req, res) {
    const context = createContext(req, res);
    try {
      const result = await controller(context, Univ);

      if (typeof result !== "undefined") return context.emit(result);
    } catch (error) {
      if (Univ.errorTracker) {
        const trackerResult = await Univ.errorTracker(error, context);

        if (trackerResult instanceof Error) {
          res.send(trackerResult);
          return;
        }
        if (trackerResult === false) return;
      }

      res.send(error);
    }
  };
}
