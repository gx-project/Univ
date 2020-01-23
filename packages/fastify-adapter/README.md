## Univ Fastify adapter

Adapter layer for use Univ with Fastify

### Api

```javascript
    UnivFastify( options: {
      middlewares: {
        helmet: boolean | object = true,
        formBody: boolean | object = true,
        multiPart: boolean | object = true
      },
      ...FastifyOptions
    }): FrameworkInstance
```
