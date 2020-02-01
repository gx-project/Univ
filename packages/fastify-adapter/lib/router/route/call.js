"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = callAdaptLayer;

var _context = _interopRequireDefault(require("./context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function callAdaptLayer(Univ, controller) {
  return async function (req, res) {
    const univContext = (0, _context.default)(req, res);
    const frameworkContext = {
      req,
      res
    };

    try {
      const result = await controller(univContext, frameworkContext, Univ);
      if (typeof result !== "undefined") return univContext.emit(result);
    } catch (error) {
      if (Univ.errorTracker) {
        const trackerResult = await Univ.errorTracker(error, univContext, frameworkContext);

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

module.exports = exports.default;