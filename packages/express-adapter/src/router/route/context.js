import requestAdapter from "./request";
import responseAdapter from "./response";

export default function createContext(req, res) {
  return {
    request: requestAdapter(req),
    response: responseAdapter(res, req),
    cookies: {
      set: (key, value, options) => res.cookie(key, value, options),
      get: (key, { signed = false } = {}) => {
        return signed ? req.signedCookies[key] : req.cookies[key];
      }
    }
  };
}
