"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = callAdaptLayer;

var _request = _interopRequireDefault(require("./request"));

var _response = _interopRequireDefault(require("./response"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function callAdaptLayer(Univ, controller) {
  return async function (req, res) {
    try {
      const request = (0, _request.default)(req);
      const response = (0, _response.default)(res);
      const result = await controller({
        request,
        response,
        instance: Univ.fwInstance
      }, Univ);
      return response.emit(result);
    } catch (error) {
      req.log.error(error);
      return res.send(error);
    }
  };
}

module.exports = exports.default;