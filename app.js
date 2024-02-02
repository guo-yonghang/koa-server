const Koa = require("koa");
const path = require("path");
const router = require("koa-router")();
const render = require("koa-art-template");
const bodyParser = require("koa-bodyparser");
const static = require("koa-static");
const session = require("koa-session");

const app = new Koa();

render(app, {
  root: path.join(__dirname, "views"),
  extname: ".html",
  debug: true,
});

app.use(bodyParser());

app.use(static(__dirname + "/static"));

app.keys = ["some secret hurr"];

app.use(
  session(
    {
      key: "koa:sess",
      maxAge: 86400000,
      overwrite: true,
      httpOnly: true,
      signed: true,
      renew: true,
    },
    app
  )
);

app.use(async (ctx, next) => {
  console.log(new Date().toLocaleString());
  await next();
  if (ctx.status === 404) {
    ctx.status = 404;
    ctx.body = "路径为空";
  }
});

router
  .get("/", async (ctx) => {
    console.log("cookie:" + ctx.cookies.get("username"));
    console.log("session:" + ctx.session?.username);
    await ctx.render("index", {
      username: "guoyonghang",
      age: 20,
    });
  })
  .get("/about", async (ctx, next) => {
    console.log(ctx.query);
    console.log(ctx.querystring);
    await next();
  })
  .get("/about", async (ctx) => {
    ctx.body = `About Page`;
  })
  .post("/login", async (ctx) => {
    console.log(ctx.request.body);
    //设置session
    ctx.cookies.set("username", "cookie.guoyonghang", {
      maxAge: 60 * 1000 * 60 * 24,
      httpOnly: true,
    });
    ctx.body = ctx.request.body;
    ctx.session.username = "session.guoyonghang";
  });

app.use(router.routes(), router.allowedMethods());

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

class Db {
  static getInstance() {
    if (!Db.instance) {
      Db.instance = new Db();
    }
    return Db.instance;
  }
  constructor() {
    this.connect();
  }
  connect() {
    console.log("connect mongoose");
  }
  find() {}
}

const db1 = Db.getInstance();
const db2 = Db.getInstance();
const db3 = Db.getInstance();
const db4 = Db.getInstance();
