import Busboy from "busboy";

export default function requestAdapter(request) {
  return {
    body: request.body,
    query: request.query,
    params: request.params,
    ip: request.ip,
    ips: request.ips,
    headers: request.headers,
    busboy: function UnivExpressBusboy(options = {}) {
      const busboy = new Busboy({ headers: request.headers, ...options });
      request.pipe(busboy);

      return busboy;
    }
  };
}
