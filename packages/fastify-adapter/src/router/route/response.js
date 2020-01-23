class UnivFastifyErrorResponse extends Error {
  constructor(message, { code, statusCode = 500, headers = {} }) {
    super(message);

    if (code) this.code = code;
    this.statusCode = statusCode;
    this.message = message;
    this.headers = headers;
  }
}

export default function responseAdapter(res, req) {
  return {
    emit: function fastifyEmitReponse(response) {
      const {
        code = 200,
        type = "application/json",
        charset = "utf-8",
        redirect,
        headers,
        content,
        error
      } = response;

      if (response instanceof Error) return res.send(response);

      if (error) {
        const { message, ...fragments } = error;

        return res.send(new UnivFastifyErrorResponse(message, fragments));
      }

      if (headers) {
        res.headers(headers);
      }

      if (redirect) {
        return res.redirect(redirect);
      }

      return res
        .code(code)
        .header("Content-Type", `${type}; charset=${charset}`)
        .send(content);
    }
  };
}
