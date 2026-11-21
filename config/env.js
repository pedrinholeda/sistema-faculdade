// Reads settings from the environment so no secret lives in the code.
// Locally they come from .env (see .env.example); in production, from the host.

const required = ["SESSION_SECRET"];

function loadConfig(env = process.env) {
  const missing = required.filter((name) => !env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
  return {
    port: Number(env.PORT) || 8081,
    mongoUri: env.MONGODB_URI || "mongodb://localhost/sistema-faculdade",
    sessionSecret: env.SESSION_SECRET,
    mail: {
      host: env.SMTP_HOST || "",
      port: Number(env.SMTP_PORT) || 587,
      user: env.SMTP_USER || "",
      pass: env.SMTP_PASS || "",
      from: env.MAIL_FROM || "no-reply@localhost",
    },
  };
}

module.exports = { loadConfig };
