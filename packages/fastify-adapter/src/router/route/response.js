class UnivErrorResponse extends Error {
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
    emit: function emitReponse(response) {
      const {
        code = 200,
        type = "application/json",
        charset = "utf-8",
        redirect,
        headers,
        content,
        error
      } = response;

      if (response instanceof Error) {
        res.send(response);
        return;
      }

      if (error) {
        const { message, ...fragments } = error;

        res.send(new UnivErrorResponse(message, fragments));
        return;
      }

      if (headers) {
        res.headers(headers);
      }

      if (redirect) {
        res.redirect(redirect);
        return;
      }

      res
        .code(code)
        .header("Content-Type", `${type}; charset=${charset}`)
        .send(content);
    }
  };
}
