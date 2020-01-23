import Busboy from "busboy";

export default function requestAdapter(request) {
  return {
    body: request.body,
    query: request.query,
    params: request.params,
    ip: request.ip,
    ips: request.ips,
    headers: request.headers,
    busboy: function UnivFastifyBusboy(options = {}) {
      const busboy = new Busboy({ headers: request.headers, ...options });

      request.raw.pipe(busboy);

      return busboy;
    }
  };
}
