const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { eAdmin } = require("../helpers/eAdmin");

router.get("/registro", (req, res) => {
  res.render("usuarios/registro");
});

router.post("/registro", (req, res) => {
  var erros = [];

  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  ) {
    erros.push({ texto: "Nome inválido" });
  }

  if (
    !req.body.email ||
    typeof req.body.email == undefined ||
    req.body.email == null
  ) {
    erros.push({ texto: "E-mail inválido" });
  }

  if (
    !req.body.senha ||
    typeof req.body.senha == undefined ||
    req.body.senha == null
  ) {
    erros.push({ texto: "Senha inválida" });
  }

  if (req.body.senha.length < 4) {
    erros.push({ texto: "Senha muito curta" });
  }

  if (req.body.senha != req.body.senha2) {
    erros.push({ texto: "As senhas são diferentes, tente novamente!" });
  }

  if (erros.length > 0) {
    res.render("usuarios/registro", { erros: erros });
  } else {
    Usuario.findOne({ email: req.body.email })
      .then(usuario => {
        if (usuario) {
          req.flash(
            "error_msg",
            "Já existe uma conta com este e-mail no nosso sistema "
          );
          res.redirect("/usuarios/registro");
        } else {
          const novoUsuario = new Usuario({
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha
          });

          bcrypt.genSalt(10, (erro, salt) => {
            bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
              if (erro) {
                req.flash("error_msg", "Houve um error ao salvar o usuario");
              }

              novoUsuario.senha = hash;

              novoUsuario
                .save()
                .then(() => {
                  req.flash("success_msg", "Usuario criado com sucesso");
                  res.redirect("/");
                })
                .catch(err => {
                  req.flash(
                    "error_msg",
                    "Houve um erro ao criar o usuario, tente novamente!"
                  );
                  res.redirect("/usuarios/registro");
                });
            });
          });
        }
      })
      .catch(err => {
        req.flash("error_msg", "Houve um erro");
        res.redirect("/");
      });
  }
});

router.get("/login", (req, res) => {
  res.render("usuarios/login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/usuarios/login",
    failureFlash: true
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Deslogado com sucesso!");
  res.redirect("/");
});

router.get("/registroADM", eAdmin, (req, res) => {
  res.render("usuarios/registroADM");
});

router.post("/registroADM", eAdmin, (req, res) => {
  var erros = [];
  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  ) {
    erros.push({ texto: "Nome inválido" });
  }
  if (
    !req.body.email ||
    typeof req.body.email == undefined ||
    req.body.email == null
  ) {
    erros.push({ texto: "E-mail inválido" });
  }
  if (
    !req.body.senha ||
    typeof req.body.senha == undefined ||
    req.body.senha == null
  ) {
    erros.push({ texto: "Senha inválido" });
  }
  if (req.body.senha.length < 4) {
    erros.push({ texto: "Senha muito curta" });
  }
  if (req.body.senha != req.body.senha2) {
    erros.push({ texto: "as senhas são diferentes" });
  }
  if (erros.length > 0) {
    res.render("usuarios/registroADM", { erros: erros });
  } else {
    Usuario.findOne({ email: req.body.email })
      .then(usuario => {
        if (usuario) {
          req.flash("error_msg", "Email ja registrado!");
          res.redirect("/usuarios/registroADM");
        } else {
          const novoUsuario = new Usuario({
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha,
            eAdmin: 1
          });
          bcrypt.genSalt(10, (erro, salt) => {
            bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
              if (erro) {
                req.flash("error_msg", "Error ao salvar usuário");
                res.redirect("/");
              }
              novoUsuario.senha = hash;
              novoUsuario
                .save()
                .then(() => {
                  req.flash(
                    "success_msg",
                    "Usuário Admnistrador criado com sucesso!"
                  );
                  res.redirect("/");
                })
                .catch(err => {
                  req.flash(
                    "error_msg",
                    "Error ao criar o usuário, tente novamente!"
                  );
                  res.redirect("/usuarios/registroADM");
                });
            });
          });
        }
      })
      .catch(err => {
        req.flash("error_msg", "Houve error interno");
        res.redirect("/");
      });
  }
});
router.get("/registroProfessor", eAdmin, (req, res) => {
  res.render("usuarios/registroProfessor");
});

router.post("/registroProfessor", eAdmin, (req, res) => {
  var erros = [];
  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  ) {
    erros.push({ texto: "Nome inválido" });
  }
  if (
    !req.body.email ||
    typeof req.body.email == undefined ||
    req.body.email == null
  ) {
    erros.push({ texto: "E-mail inválido" });
  }
  if (
    !req.body.senha ||
    typeof req.body.senha == undefined ||
    req.body.senha == null
  ) {
    erros.push({ texto: "Senha inválido" });
  }
  if (req.body.senha.length < 4) {
    erros.push({ texto: "Senha muito curta" });
  }
  if (req.body.senha != req.body.senha2) {
    erros.push({ texto: "as senhas são diferentes" });
  }
  if (erros.length > 0) {
    res.render("usuarios/registroProfessor", { erros: erros });
  } else {
    Usuario.findOne({ email: req.body.email })
      .then(usuario => {
        if (usuario) {
          req.flash("error_msg", "Email ja registrado!");
          res.redirect("/usuarios/registroProfessor");
        } else {
          const novoUsuario = new Usuario({
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha,
            eProfessor: 1
          });
          bcrypt.genSalt(10, (erro, salt) => {
            bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
              if (erro) {
                req.flash("error_msg", "Error ao salvar usuário");
                res.redirect("/");
              }
              novoUsuario.senha = hash;
              novoUsuario
                .save()
                .then(() => {
                  req.flash("success_msg", "Professor Cadastrado com sucesso!");
                  res.redirect("/");
                })
                .catch(err => {
                  req.flash(
                    "error_msg",
                    "Error ao Cadastrar Professor, tente novamente!"
                  );
                  res.redirect("/usuarios/registroProfessor");
                });
            });
          });
        }
      })
      .catch(err => {
        req.flash("error_msg", "Houve error interno");
        res.redirect("/");
      });
  }
});

router.get("/sobre", (req, res) => {
  res.render("usuarios/sobre");
});

module.exports = router;
