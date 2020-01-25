import SocketServer from "socket.io";
import Enhance from "./enhance";

export default function UnivSocketIO(options = {}) {
  return function(Univ) {
    let server;
    switch (Univ.adapter.engine) {
      case "express":
      case "fastify":
        server = Univ.server.instance.server;
        break;
    }

    const ioServer = SocketServer(server, options);
    Enhance(ioServer);

    return ioServer;
  };
}
