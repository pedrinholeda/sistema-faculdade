const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "eeadb040819107",
    pass: "9f993d6c332a4d"
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
