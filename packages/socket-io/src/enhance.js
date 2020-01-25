export default function EnhanceSocketIO(io) {
  io.use((socket, next) => {
    socket.listen = (event, handler) => {
      let catchError;
      socket.on(event, async (data, ack) => {
        try {
          const response = await handler(data);

          if (typeof response !== "undefined") {
            ack(response);
          }
        } catch (error) {
          if (catchError && typeof catchError === "function") catchError(error);

          if (io.onSocketError && typeof io.onSocketError === "function")
            return io.onSocketError(socket, event, error);
        }
      });

      return {
        error: handler => (catchError = handler)
      };
    };
    next();
  });
}
