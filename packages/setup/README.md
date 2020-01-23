## Univ Setup

The top of the abstraction

### Usage

```javascript
  const Univ = require("@univ/setup");
  const UnivFastify = require("@univ/fastify-adapter");

  const app = Univ( UnivFastify({
    port: 3000
  }), app => {
    app.get("/", ctx => {
      return { data: "hello world" };
    });

    await app.start();

  });

```

### Api

**`Univ( adapter: UnivFrameworkAdapter, builder: function ): FrameworkInstance`**
