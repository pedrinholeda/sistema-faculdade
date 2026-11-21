const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const { mail } = require("../config/env").loadConfig();

const transport = nodemailer.createTransport({
  host: mail.host,
  port: mail.port,
  auth: {
    user: mail.user,
    pass: mail.pass
  }
});

transport.use(
  "compile",
  hbs({
    // configurando transporte
    viewEngine: {
      viewEngine: "handlebars",
      partialsDir: "some/path",
      defaultLayout: false
    },
    viewPath: path.resolve("./resources/mail/"),
    extName: ".html"
  })
);

module.exports = transport;
