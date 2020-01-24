import createContext from "./context";
import { sendError } from "./response";

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

        if (trackerResult instanceof Error)
          return sendError(res, trackerResult);
        if (trackerResult === false) return;
      }

      return sendError(res, error);
    }
  };
}
