# Univ

In devepoment, not published yet.

##### An abstraction layer with some useful things to build node http server using a single code base that works with most used frameworks, focusing on easy switching.

### Why

Following objective of the Primus, built to prevent framework lock-in. Make a framework switch easy with a simple server restart. This is useful in case of some serious security issue.

### Advantages

- Easy to create routes.
- Enhance security
- Good for api

### Usage

##### You need the Setup and a adapter.

```shell
npm i @univ/setup @univ/fastify
```

```javascript
    import Univ from "@univ/setup";
    import UnivFastify from "@univ/fastify"

    const app = Univ(UnivFastify({
        port: 3000
    }));

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
    })
```
