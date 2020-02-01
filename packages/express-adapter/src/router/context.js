import Busboy from "busboy";

import createEmitter from "./emitter";

const contextAttachs = Symbol("univAttachs");

const reservedKeys = [
  "body",
  "query",
  "params",
  "ip",
  "ips",
  "headers",
  "busboy",
  "hostname",
  "raw",
  "cookies",
  "attach",
  "framework",
  "emit"
];

export default function createContext(req, res) {
  if (!req[contextAttachs]) req[contextAttachs] = {};

  return {
    ...req[contextAttachs],
    framework: { req, res },
    body: req.body,
    query: req.query,
    params: req.params,
    ip: req.ip,
    ips: req.ips,
    headers: req.headers,
    emit: createEmitter(res, req),
    busboy: function UnivExpressBusboy(options = {}) {
      const busboy = new Busboy({ headers: req.headers, ...options });
      req.pipe(busboy);

      return busboy;
    },
    cookies: {
      set: (key, value, options) => res.cookie(key, value, options),
      get: (key, { signed = false } = {}) => {
        return signed ? req.signedCookies[key] : req.cookies[key];
      }
    },
    attach(key, value) {
      if (reservedKeys.indexOf(key) !== -1) {
        throw new Error(
          `You can't attach a reserved property name ${key} to context`
        );
      }

      req[contextAttachs][key] = value;
    }
  };
}
