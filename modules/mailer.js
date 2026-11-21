const nodemailer = require("nodemailer");
const hbsModule = require("nodemailer-express-handlebars");
const hbs = hbsModule.default || hbsModule;
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
      extname: ".html",
      partialsDir: path.resolve("./resources/mail/"),
      defaultLayout: false
    },
    viewPath: path.resolve("./resources/mail/"),
    extName: ".html"
  })
);

module.exports = transport;
