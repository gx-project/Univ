import createContext from "./context";

export default function callAdaptLayer(Univ, controller) {
  return async function(req, res) {
    const univContext = createContext(req, res);
    const frameworkContext = { req, res };
    try {
      const result = await controller(univContext, frameworkContext, Univ);

      if (typeof result !== "undefined")
        return univContext.response.emit(result);
    } catch (error) {
      if (Univ.errorTracker) {
        const trackerResult = await Univ.errorTracker(
          error,
          univContext,
          frameworkContext
        );

        if (trackerResult instanceof Error) return res.send(trackerResult);
        if (trackerResult === false) return;
      }

      return res.send(error);
    }
  };
}
