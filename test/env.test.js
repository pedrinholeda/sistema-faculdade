const { test } = require("node:test");
const assert = require("node:assert");
const { loadConfig } = require("../config/env");

test("fails fast without SESSION_SECRET", () => {
  assert.throws(() => loadConfig({}), /SESSION_SECRET/);
});

test("uses defaults for optional settings", () => {
  const config = loadConfig({ SESSION_SECRET: "x" });
  assert.strictEqual(config.port, 8081);
  assert.strictEqual(config.mongoUri, "mongodb://localhost/sistema-faculdade");
  assert.strictEqual(config.mail.port, 587);
});

test("reads values from the environment", () => {
  const config = loadConfig({
    SESSION_SECRET: "s",
    PORT: "3000",
    MONGODB_URI: "mongodb://db/app",
    SMTP_USER: "u",
    MAIL_FROM: "a@b.c",
  });
  assert.strictEqual(config.port, 3000);
  assert.strictEqual(config.mongoUri, "mongodb://db/app");
  assert.strictEqual(config.mail.user, "u");
  assert.strictEqual(config.mail.from, "a@b.c");
});
