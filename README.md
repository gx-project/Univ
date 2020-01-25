# Univ

[![build](https://travis-ci.org/GX-mob/Univ.svg?branch=master)](https://travis-ci.org/GX-mob/Univ)
[![codecov](https://codecov.io/gh/GX-mob/Univ/branch/master/graph/badge.svg)](https://codecov.io/gh/GX-mob/Univ)

In development, not published in npm, yet.

##### An abstraction layer with some useful things to build node http server using a single code base that works with most used frameworks, focusing on easy switching.

### Why

Following objective of the Primus, built to prevent framework lock-in. Make a framework switch easy with a simple server restart. This is useful in case of some serious security issue.

### Advantages

- Easy to create routes.
- Enhance security
- Good for api

### Usage

##### You need the Setup and an adapter.

```shell
npm i @univ/setup @univ/fastify
```

```javascript
import Univ from "@univ/setup";
import fastify from "@univ/fastify"
import sockets from "@univ/socket-io"

const app = Univ(fastify,{
  port: 3000
});

app.attach("redis", ioRedisClient);
app.attach("socket", sockets())

// In the contoller function you get 3 params, UnivContext, FrameworkContext, UnivInstance
app.get("/", async uctx => {
  return { content: { data: "ok" }
});
/*
  GET /
  status: 200
  content-type: application/json
  content: { data: "ok" }
*/

app.endpoint("/users", users => {
  users.get("/not-exist", uctx => {
    return { error: {
      statusCode: 404,
      message: "you're lost"
    }}
  })
/*
  GET /users/not-exist
  status: 404
  content-type: application/json
  content: { statusCode: 404, error: "Not Found", message: "you're lost" }
*/

app.sockets.on("connection", socket => {
  socket.listen("message", async content => {
    try {
      const messages = await app.redis.get("messages");

      messages.push({ content, author: socket.id, ts: Date.now() });

      await app.redis.set("messages", messages);

      // auto ack
      return { success: true };
    } catch (e) {
      console.error(e);

      // auto ack
      return { sucess: false }
    }

  });
});
})
```
