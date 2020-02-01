import createContext from "./context";
import { sendError } from "./emitter";

export default function callAdaptLayer(Univ, controller) {
  return async function(req, res) {
    const context = createContext(req, res);

    try {
      const result = await controller(context, Univ);

      if (typeof result !== "undefined") return context.emit(result);
    } catch (error) {
      if (Univ.errorTracker) {
        const trackerResult = await Univ.errorTracker(error, context);

        if (trackerResult instanceof Error)
          return sendError(res, trackerResult);
        if (trackerResult === false) return;
      }

      return sendError(res, error);
    }
  };
}
