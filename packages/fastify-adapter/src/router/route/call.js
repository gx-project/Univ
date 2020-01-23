import requestAdapter from "./request";
import responseAdapter from "./response";

export default function callAdaptLayer(Univ, controller) {
  return async function(req, res) {
    try {
      const request = requestAdapter(req);
      const response = responseAdapter(res, req);

      const result = await controller(
        { request, response, instance: Univ.fwInstance },
        { req, res },
        Univ
      );

      if (typeof result !== "undefined") return response.emit(result);
    } catch (error) {
      return res.send(error);
    }
  };
}
