// End-to-end flow against a real (in-memory) MongoDB: sign up, log in,
// manage a course as admin and see it on the public page.
const { test, before, after } = require("node:test");
const assert = require("node:assert");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let mongo;
let app;

before(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri("sistema-faculdade");
  process.env.SESSION_SECRET = "test-secret";
  app = require("../app");
  await mongoose.connection.asPromise();
});

after(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test("public pages render", async () => {
  for (const url of ["/", "/cursos", "/usuarios/login", "/usuarios/registro"]) {
    const res = await request(app).get(url);
    assert.strictEqual(res.status, 200, url);
  }
});

test("a student signs up, logs in and logs out", async () => {
  const agent = request.agent(app);
  await agent
    .post("/usuarios/registro")
    .type("form")
    .send({ nome: "Ana", email: "ana@example.com", senha: "1234", senha2: "1234" })
    .expect(302)
    .expect("Location", "/");

  await agent
    .post("/usuarios/login")
    .type("form")
    .send({ email: "ana@example.com", senha: "1234" })
    .expect(302)
    .expect("Location", "/");

  const home = await agent.get("/").expect(200);
  assert.match(home.text, /Ana/);

  // Students cannot reach admin pages.
  await agent.get("/admin/cursos").expect(302).expect("Location", "/");

  await agent.get("/usuarios/logout").expect(302).expect("Location", "/");
});

test("a wrong password does not log in", async () => {
  await request(app)
    .post("/usuarios/login")
    .type("form")
    .send({ email: "ana@example.com", senha: "wrong" })
    .expect(302)
    .expect("Location", "/usuarios/login");
});

test("an admin creates a course that shows on the public page", async () => {
  const Usuario = mongoose.model("usuarios");
  await new Usuario({
    nome: "Admin",
    email: "admin@example.com",
    senha: await bcrypt.hash("admin", 10),
    eAdmin: 1,
  }).save();

  const agent = request.agent(app);
  await agent
    .post("/usuarios/login")
    .type("form")
    .send({ email: "admin@example.com", senha: "admin" })
    .expect(302)
    .expect("Location", "/");

  await agent
    .post("/admin/cursos/nova")
    .type("form")
    .send({ nome: "Engenharia", slug: "engenharia", descricao: "Curso de teste" })
    .expect(302)
    .expect("Location", "/admin/cursos");

  const admin = await agent.get("/admin/cursos").expect(200);
  assert.match(admin.text, /Engenharia/);

  const page = await request(app).get("/cursos").expect(200);
  assert.match(page.text, /Engenharia/);
});
