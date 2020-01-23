"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = responseAdapter;

function responseAdapter(response) {
  return {
    raw: response,
    emit: function fastifyEmitReponse({
      code = 200,
      type = "application/json",
      charset = "utf-8",
      redirect,
      headers,
      content
    }) {
      if (headers) {
        response.headers(headers);
      }

      if (redirect) {
        return response.redirect(redirect);
      }

      return response.code(code).header("Content-Type", `${type}; charset=${charset}`).send(content);
    }
  };
}

module.exports = exports.default;