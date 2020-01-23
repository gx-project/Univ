const httpErrors = {
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  418: "Im A Teapot",
  421: "Misdirected Request",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  425: "Unordered Collection",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  451: "Unavailable ForLegal Reasons",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  509: "Bandwidth Limit Exceeded",
  510: "Not Extended",
  511: "Network Authentication Required"
};

class UnivExpressErrorResponse extends Error {
  constructor(message, { code, statusCode = 500, headers = {} }) {
    super(message);

    if (code) this.code = code;
    this.statusCode = statusCode;
    this.message = message;
    this.headers = headers;
  }
}

export function sendError(res, error) {
  const { statusCode = 500, headers, message, code } = error;

  return res
    .set(headers)
    .status(statusCode)
    .send({ statusCode, message, code, error: httpErrors[statusCode] });
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

      if (response instanceof Error) return sendError(res, response);

      if (error) {
        const { message, ...fragments } = error;

        return sendError(res, new UnivExpressErrorResponse(message, fragments));
      }
      if (headers) {
        res.set(headers);
      }

      if (redirect) {
        return res.redirect(redirect);
      }

      return res
        .status(code)
        .set("Content-Type", `${type}; charset=${charset}`)
        .send(content);
    }
  };
}
