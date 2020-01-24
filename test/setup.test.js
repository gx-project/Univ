import Univ from "../packages/setup/src";
import { kAdapter, kServer } from "../packages/setup/src/symbols";
import UFastify from "../packages/fastify-adapter/src/index";
import UExpress from "../packages/express-adapter/src/index";
import request from "supertest";
import { expect } from "chai";

const e500 = {
  statusCode: 500,
  error: "Internal Server Error"
};

describe("Univ", () => {
  it("Throw if not provided adapter", () => {
    expect(() => Univ()).to.throw("You need specify a framework adapter");
  });

  it("Throw if invalid adapter", () => {
    expect(() => Univ(true)).to.throw("This adapter is invalid");
  });

  it("Throw if attempt to attach reserved property name", () => {
    expect(() => {
      const app = Univ(UFastify());

      app.attach("get", "foo");
    }).to.throw('You can\'t use a reserved property name "get" to instance');
  });

  it("Throw if attempt to attach already declared property name", () => {
    expect(() => {
      Univ(UFastify(), app => {
        app.attach("foo", "bar");
        app.attach("foo", "bar");
      });
    }).to.throw('You already declared the property name "foo" to instance');
  });

  testWith("Fastify", UFastify);
  testWith("Express", UExpress);
  // testWith("Koa", UKoa);
  // testWith("Restify", URestify);
});

function testWith(title, adapter) {
  describe(`${title} adapter`, () => {
    let app;

    const make = options => {
      app = Univ(adapter(options));
    };

    afterEach(done => {
      app.close(done);
    });

    /**
     * General
     */
    it("Be a valid Univ instance", async () => {
      make();

      const keys = [
        [kAdapter, "object"],
        [kServer, "object"],
        ["engine", "string"],
        ["adapterVersion", "string"],
        ["fwInstance", "object|function"],
        ["endpoint", "function"],
        ["get", "function"],
        ["post", "function"],
        ["put", "function"],
        ["delete", "function"],
        ["options", "function"],
        ["head", "function"],
        ["patch", "function"]
      ];

      const props = [
        ["start", "function"],
        ["close", "function"],
        ["attach", "function"]
      ];

      expect(app)
        .to.be.an("object")
        .that.has.all.keys(keys.map(([key]) => key));

      keys.map(([key, type]) =>
        expect(typeof app[key]).to.match(new RegExp(type))
      );

      props.map(([prop, type]) =>
        expect(app)
          .to.have.property(prop)
          .that.be.a(type)
      );

      await app.start();

      expect(app)
        .to.have.property("server")
        .that.be.a("object")
        .that.have.all.keys("address", "family", "port");
    });

    it("Callback start", done => {
      make();
      app.start(server => {
        expect(server).to.have.property("address");
        expect(server)
          .to.have.property("port")
          .to.be.a("number");

        done();
      });
    });

    it("Simple routing", async () => {
      make();

      const content = { content: { data: "hello" } };
      const methods = [
        ["get", content],
        ["put", content],
        ["post", content],
        ["delete", false],
        ["options", ""],
        ["head", false],
        ["patch", ""]
      ];

      app.get("/", {
        async controller(ctx) {
          return content;
        }
      });

      methods.map(([method, content]) => {
        if (method === "get") return;
        app[method]("/", ctx => content);
      });

      app.endpoint("/users", users => {
        users.get("/", ctx => content);
      });

      await app.start();
      const baseUrl = `http://localhost:${app.server.port}`;

      await Promise.all([
        ...methods.map(([method, content]) =>
          makeRequest(baseUrl, "", method, content)
        ),
        makeRequest(baseUrl, "/users", "get", content.content)
      ]);

      function makeRequest(base, url, method, content) {
        const Request = request.agent(base)[method](url);

        if (content)
          return Request.expect("Content-Type", /json/).expect(
            200,
            content && content.content ? content.content : content
          );

        return Request.expect(200);
      }
    });

    it("Configure helmet middleware", async () => {
      make({
        middlewares: {
          helmet: { hidePoweredBy: { setTo: "PHP 4.2.0" } }
        }
      });

      app.get("/", uctx => {
        return { content: "" };
      });

      await app.start();

      const baseUrl = `http://localhost:${app.server.port}`;

      await request
        .agent(baseUrl)
        .get("/")
        .expect("X-Powered-By", "PHP 4.2.0")
        .expect(200);
    });

    it("Set headers", async () => {
      make();

      app.get("/", ctx => {
        return { headers: { foo: "bar" } };
      });

      await app.start();
      const baseUrl = `http://localhost:${app.server.port}`;

      await request
        .agent(baseUrl)
        .get("/")
        .expect("foo", "bar")
        .expect(200);
    });

    it("Redirect", async () => {
      make();

      app.get("/", ctx => {
        return { redirect: "/other" };
      });

      app.get("/other", ctx => {
        return { content: { data: "hi" } };
      });

      await app.start();
      const baseUrl = `http://localhost:${app.server.port}`;

      await request
        .agent(baseUrl)
        .get("/")
        .expect(302)
        .expect("Location", "/other");
    });

    /**
     * Erros
     */
    describe("Errors", () => {
      describe("Tracker", () => {
        it("Set error track", async () => {
          make();

          app.setErrorTracker(() => {});

          expect(app.errorTracker).to.be.a("function");

          await app.start();
        });

        it("Change error object", async () => {
          make();

          app.setErrorTracker(async error => {
            error.statusCode = 501;
          });

          app.get("/", () => {
            throw new Error("tra");
          });

          await app.start();
          const baseUrl = `http://localhost:${app.server.port}`;

          await request
            .agent(baseUrl)
            .get("/")
            .expect(501);
        });

        it("Stop the flow and change the response", async () => {
          make();

          app.setErrorTracker(async (error, UnivCtx) => {
            if (error.message === "tra") {
              UnivCtx.response.emit({ content: { ok: true } });

              return false;
            }
          });

          app.get("/", () => {
            throw new Error("tra");
          });

          await app.start();
          const baseUrl = `http://localhost:${app.server.port}`;

          await request
            .agent(baseUrl)
            .get("/")
            .expect(200, { ok: true });
        });

        it("Return a error instance", async () => {
          make();

          app.setErrorTracker(() => {
            return new Error("A error instance");
          });

          app.get("/", () => {
            throw new Error("tra");
          });

          await app.start();
          const baseUrl = `http://localhost:${app.server.port}`;

          await request
            .agent(baseUrl)
            .get("/")
            .expect(500, { ...e500, message: "A error instance" });
        });
      });

      it("Throw in controller", async () => {
        make();

        app.get("/", ctx => {
          throw new Error("test");
        });

        await app.start();
        const baseUrl = `http://localhost:${app.server.port}`;

        await request
          .agent(baseUrl)
          .get("/")
          .expect(500);
      });

      it('"error" property in controller return object', async () => {
        make();

        app.get("/", ctx => {
          return {
            error: {
              message: "voc"
            }
          };
        });

        await app.start();
        const baseUrl = `http://localhost:${app.server.port}`;

        await request
          .agent(baseUrl)
          .get("/")
          .expect(500, { ...e500, message: "voc" });
      });

      it("Controller return error instance", async () => {
        make();

        app.get("/", ctx => {
          return new Error("Custom message");
        });

        await app.start();
        const baseUrl = `http://localhost:${app.server.port}`;

        await request
          .agent(baseUrl)
          .get("/")
          .expect(500, { ...e500, message: "Custom message" });
      });

      it("Custom params", async () => {
        make();

        app.get("/404-object", ctx => {
          return {
            error: {
              code: "1",
              statusCode: 404,
              message: "D:",
              headers: { foo: "bar" }
            }
          };
        });

        await app.start();
        const baseUrl = `http://localhost:${app.server.port}`;

        await request
          .agent(baseUrl)
          .get("/404-object")
          .expect("foo", "bar")
          .expect(404, {
            code: "1",
            statusCode: 404,
            message: "D:",
            error: "Not Found"
          });
      });
    });

    /**
     * Busboy
     */
    describe("Busboy", () => {
      it("Error if not valid Content-Type", async () => {
        make();

        app.get("/", UnivContext => {
          UnivContext.request.busboy();
        });

        await app.start();
        const baseUrl = `http://localhost:${app.server.port}`;

        await request
          .agent(baseUrl)
          .get("/")
          .expect("Content-Type", /json/)
          .expect(500, {
            statusCode: 500,
            error: "Internal Server Error",
            message: "Missing Content-Type"
          });
      });

      it("Handle fields", async () => {
        make();

        app.post("/", UnivContext => {
          const fields = {};
          const busboy = UnivContext.request.busboy();

          busboy.on("field", (key, value) => {
            fields[String(key)] = value;
          });

          busboy.on("finish", () => {
            UnivContext.response.emit({
              content: { ok: true, bytwo: parseInt(fields.foo) * 2 }
            });
          });
        });

        await app.start();
        const baseUrl = `http://localhost:${app.server.port}`;

        await request
          .agent(baseUrl)
          .post("/")
          .field("foo", 5)
          .expect("Content-Type", /json/)
          .expect(200, { ok: true, bytwo: 10 });
      });

      it("Handle upload", async () => {
        make();

        app.post("/", UnivContext => {
          let fileContent;
          const busboy = UnivContext.request.busboy();

          busboy.on("file", (field, stream, name, encoding, mime) => {
            const chunks = [];

            stream.on("data", chunk => chunks.push(chunk));
            stream.on("end", () => (fileContent = chunks.toString()));
          });

          busboy.on("finish", () => {
            UnivContext.response.emit({
              content: { fileContent }
            });
          });
        });

        await app.start();
        const baseUrl = `http://localhost:${app.server.port}`;

        await request
          .agent(baseUrl)
          .post("/")
          .attach("file", Buffer.from("ok"), "testUpload.txt")
          .expect("Content-Type", /json/)
          .expect(200, { fileContent: "ok" });
      });
    });

    /**
     * Cookies
     */
    describe("Cookies", () => {
      it("Set and get", async () => {
        make({ cookies: true });

        const value = String(Date.now());

        app.get("/", ctx => {
          ctx.cookies.set("foo", value);

          return { content: { value } };
        });

        app.get("/get", ctx => {
          const cookie = ctx.cookies.get("foo");

          expect(cookie).to.be.equal(value);
          return { content: { ok: true } };
        });

        await app.start();
        const baseUrl = `http://localhost:${app.server.port}`;

        const res = await request
          .agent(baseUrl)
          .get("/")
          .expect("Content-Type", /json/)
          .expect(200, { value });

        await request
          .agent(baseUrl)
          .get("/get")
          .set("Cookie", res.headers["set-cookie"])
          .expect("Content-Type", /json/)
          .expect(200, { ok: true });
      });

      it("Signed", async () => {
        make({
          cookies: {
            secret: "asd"
          }
        });

        const value = String(Date.now());

        app.get("/", ctx => {
          ctx.cookies.set("foo", value, { signed: true });

          return { content: { value } };
        });

        app.get("/get", ctx => {
          const cookie = ctx.cookies.get("foo", { signed: true });

          expect(cookie).to.be.equal(value);

          return { content: { ok: true } };
        });

        await app.start();
        const baseUrl = `http://localhost:${app.server.port}`;

        const res = await request
          .agent(baseUrl)
          .get("/")
          .expect("Content-Type", /json/)
          .expect(200, { value });

        await request
          .agent(baseUrl)
          .get("/get")
          .set("Cookie", res.headers["set-cookie"])
          .expect("Content-Type", /json/)
          .expect(200, { ok: true });
      });
    });
  });
}
