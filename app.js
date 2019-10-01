//carregando modulos
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();
const admin = require("./routes/admin");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
require("./models/Materia");
const Materia = mongoose.model("materias");
require("./models/Curso");
const Curso = mongoose.model("cursos");
const usuarios = require("./routes/usuario");
const passport = require("passport");
require("./config/auth")(passport);

//configurações
// Sessão
app.use(
  session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
// Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null; // armazena dados do usuario logado
  next();
});
// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Mongoose
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/sistema-faculdade")
  .then(() => {
    console.log("Conectado com o Mongo");
  })
  .catch(err => {
    console.log("Erro ao se conectar: " + err);
  });
// Public
app.use(express.static(path.join(__dirname, "public")));

//rotas
app.get("/", (req, res) => {
  Materia.find()
    .populate("curso")
    .sort({ data: "desc" })
    .then(materias => {
      res.render("index", { materias: materias });
    })
    .catch(err => {
      req.flash("error_msg", "Houve um erro interno");
      res.redirect("/404");
    });
});

app.get("/materia/:slug", (req, res) => {
  Materia.findOne({ slug: req.params.slug })
    .then(materia => {
      if (materia) {
        res.render("materia/index", { materia: materia });
      } else {
        req.flash("error_msg", "Esta materia não existe");
        res.redirect("/");
      }
    })
    .catch(err => {
      req.flash("error_msg", "Houve um erro interno");
      res.redirect("/");
    });
});

app.get("/cursos", (req, res) => {
  Curso.find()
    .then(cursos => {
      res.render("cursos/index", { cursos: cursos });
    })
    .catch(err => {
      req.flash("error_msg", "Houve um erro interno ao listar os cursos");
      res.redirect("/");
    });
});

app.get("/cursos/:slug", (req, res) => {
  Curso.findOne({ slug: req.params.slug })
    .then(curso => {
      if (curso) {
        Materia.find({ curso: curso._id })
          .then(materias => {
            res.render("cursos/materias", {
              materias: materias,
              curso: curso
            });
          })
          .catch(err => {
            req.flash("error_msg", "Houve um erro ao listar os post !");
            res.redirect("/");
          });
      } else {
        req.flash("error_msg", "Este curso não existe");
        res.redirect("/");
      }
    })
    .catch(err => {
      req.flash(
        "error_msg",
        "Houve um erro interno ao carregar a página deste curso"
      );
      res.redirect("/");
    });
});

app.get("/404", (req, res) => {
  res.send("Erro 404!");
});

app.get("/post", (req, res) => {
  res.send("Lista de Post");
});

app.use("/admin", admin);
app.use("/usuarios", usuarios);
//outros
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log("Servidor Rodando! ");
});
