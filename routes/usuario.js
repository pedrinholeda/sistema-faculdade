const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { eAdmin } = require("../helpers/eAdmin");
const crypto = require("crypto");
const mailer = require("../modules/mailer");

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
            eAdmin: 1,
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

//rota render esqueci senha
router.get("/forgot_password", (req, res) => {
  res.render("usuarios/forgot_password");
});
//rota para esqueci senha
router.post("/forgot_password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Usuario.findOne({ email }); // verificando se o email esta cadastrado

    if (!user) {
      req.flash("error_msg", "Usuario não existente");
      res.redirect("/usuarios/login");
    }
    const token = crypto.randomBytes(20).toString("hex"); //gerando um token

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await Usuario.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now
      }
    });
    //console.log(token, now);
    mailer.sendMail(
      {
        to: email,
        from: "pedro.guimaraes@firstdecision.com.br",
        template: "auth/forgot_password",
        context: { token }
      },
      err => {
        if (err) {
          req.flash("error_msg", "Cannot send forgot password email, ok");
        }
      }
    );
    //console.log("chegou aqui");

    res.redirect("/usuarios/reset_password");
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Error na rota de esqueci minha senha.");
  }
});
//rota render resetar senha
router.get("/reset_password", (req, res) => {
  res.render("usuarios/reset_password");
});
//rota para resetar senha
router.post("/reset_password", async (req, res) => {
  const { email, token, senha } = req.body;
  const user = await Usuario.findOne({ email });
  if (!user) {
    //verificando se email e valido. arrumar vieew de error
    req.flash("error_msg", "Usuario não existe");
    res.redirect("/usuarios/reset_password");
  }
  try {
    const user = await Usuario.findOne({ email }).select(
      "+passwordResetToken passwordResetExpires"
    );

    if (!user) {
      //verificando se usuário exites
      req.flash("error_msg", "Usuário incorreto!");
      res.redirect("/usuarios/reset_password");
    }
    //console.log(token);
    if (token !== user.passwordResetToken) {
      // verificar se o token e valido
      req.flash("error_msg", "Token invalido");
      res.redirect("/usuarios/reset_password");
    }
    //verificar se o token esta expirado
    const now = new Date();

    if (now > user.passwordResetExpires) {
      req.flash("error_msg", "Token expirado, por favor gerar novo token");
      res.redirect("/usuarios/reset_password");
    }

    if (req.body.senha != req.body.senha2) {
      req.flash("error_msg", "Senhas são diferentes");
      res.redirect("/usuarios/reset_password");
    }

    //atualizando senha.

    user.senha = senha;
    //console.log("user senha:", user.senha);
    //await user.save();

    bcrypt.genSalt(10, (erro, salt) => {
      bcrypt.hash(user.senha, salt, (erro, hash) => {
        if (erro) {
          req.flash("error_msg", "Error ao salvar usuário");
          res.redirect("/");
        }
        user.senha = hash;
        user
          .save()
          .then(() => {
            req.flash("success_msg", "senha alterada com sucesso!");
            res.redirect("/");
          })
          .catch(err => {
            req.flash(
              "error_msg",
              "Error ao criar o usuário, tente novamente!"
            );
            res.redirect("/usuarios/registro");
          });
      });
    });
  } catch (err) {
    res.status(400).send({ error: "Cannot reset passord, try again" });
  }
});

router.get("/minhas-notas", async (req, res) => {
  try {
    const user = req.user.id;
    Usuario.findOne({ _id: user })
      .sort({ semestre: "desc" })
      .then(usuario => {
        const notafinal = [];
        for (var i = 0; i < usuario.notas.length; i++) {
          if (usuario.notas[i].nota < 6) {
            notafinal.push({
              nota: usuario.notas[i].nota,
              materia: usuario.notas[i].materia,
              semestre: usuario.notas[i].semestre,
              status: true
            });
          } else {
            notafinal.push({
              nota: usuario.notas[i].nota,
              materia: usuario.notas[i].materia,
              semestre: usuario.notas[i].semestre,
              status: false
            });
          }
        }

        res.render("usuarios/notas", { notafinal: notafinal });
      })
      .catch(err => {
        console.log("err: ", err);
        req.flash("error_msg", "Error!");
        res.redirect("/");
      });
  } catch (err) {
    res.redirect("/usuarios/login");
  }
});

//rota de minha conta
router.get("/minhaconta/:id", async (req, res) => {
  try {
    Usuario.findOne({ _id: req.params.id })
      .then(usuario => {
        res.render("usuarios/minhaconta", {
          usuario: usuario
        });
      })
      .catch(err => {
        console.log("err: ", err);
        req.flash("error_msg", "Error!");
        res.redirect("/");
      });
  } catch (err) {
    res.redirect("/usuarios/login");
  }
});

module.exports = router;
