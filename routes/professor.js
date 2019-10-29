const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Curso");
require("../models/Materia");
require("../models/Usuario"); // em teste
require("../models/Postagem");
const Materia = mongoose.model("materias");
const Postagem = mongoose.model("postagens");
const Curso = mongoose.model("cursos");
const Usuario = mongoose.model("usuarios"); // em teste
const { eProfessor } = require("../helpers/eProfessor");
const { eAdmin } = require("../helpers/eAdmin");

router.get("/", eProfessor, (req, res) => {
  res.render("professor/index");
});

// Main de Postagem (Lista de Postagem)
router.get("/postagens", eProfessor, (req, res) => {
  Postagem.find()
    .sort({ date: "desc" })
    .then(postagens => {
      res.render("professor/postagens", { postagens: postagens });
    })
    .catch(err => {
      req.flash("error_msg", "Houve um erro ao listar as Postagens");
      res.redirect("/professor");
    });
});

//Rota para renderizar View de Add Postagem
router.get("/postagens/add", eProfessor, (req, res) => {
  Materia.find().then(materias => {
    res.render("professor/addpostagem", {
      materias: materias
    });
  });
});

//Rota para realizar Postagem, com Validação por titulo
router.post("/postagens/nova", eProfessor, (req, res) => {
  var erros = [];
  if (
    !req.body.titulo ||
    typeof req.body.titulo == undefined ||
    req.body.titulo == null
  ) {
    erros.push({ texto: "Titulo inválido" });
  }
  if (req.body.titulo.length < 2) {
    erros.push({ texto: "O Nome do Titulo é muito pequeno" });
  }

  if (erros.length > 0) {
    res.render("professor/addpostagem", { erros: erros });
  } else {
    const novaPostagem = {
      titulo: req.body.titulo,
      conteudo: req.body.conteudo,
      materia: req.body.materia
    };
    //Cria um Nova Postagem com o Conteudo da Variavel auxiliar NovaPostagem
    new Postagem(novaPostagem)
      .save()
      .then(() => {
        req.flash("success_msg", "Sua postagem foi adcionada ao mural");
        res.redirect("/professor/postagens");
      })
      .catch(err => {
        req.flash(
          "error_msg",
          "Houve um erro ao lançar sua postagem, tente novamente!"
        );
        res.redirect("/professor");
      });
  }
});

//Rota de Edição de Postagem - View (Passando id da postagem editada por parametro)
router.get("/postagens/edit/:id", eProfessor, (req, res) => {
  Postagem.findOne({ _id: req.params.id })
    .then(postagem => {
      Materia.find().then(materias => {
        res.render("professor/editpostagem", {
          postagem: postagem,
          materias: materias
        });
      });
    })
    .catch(err => {
      req.flash("error_msg", "Esta postagem não existe");
      res.redirect("/professor/postagens");
    });
});
//Rota de Edição de Postagem - Logica
router.post("/postagens/edit", eProfessor, (req, res) => {
  Postagem.findOne({ _id: req.body.id })
    .then(postagem => {
      postagem.titulo = req.body.titulo;
      postagem.conteudo = req.body.conteudo;
      postagem.materia = req.body.materia;

      postagem
        .save()
        .then(() => {
          req.flash("success_msg", "Postagem editada com sucesso!");
          res.redirect("/professor/postagens");
        })
        .catch(err => {
          req.flash("error_msg", "Houve um erro ao editar a Postagem");
          res.redirect("/professor/postagens");
        });
    })
    .catch(err => {
      req.flash("error_msg", "Houve um erro ao editar a postagem");
      res.redirect("/professor/postagens");
    });
});

//Rota de Deletar Postagem
router.post("/postagens/deletar", eProfessor, (req, res) => {
  Postagem.deleteOne({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Postagem deletada com sucesso!");
      res.redirect("/professor/postagens");
    })
    .catch(err => {
      req.flash("error_msg", "Houve um erro ao deletar a Postagem");
      res.redirect("/professor/postagens");
    });
});

//Rota que Lista Materias Disponiveis Para Lançamento de Notas
router.get("/view-notas", eProfessor, (req, res) => {
  const professor = req.user.id; //variavel para guardar id do professor
  Materia.find({ professor }) //comparando campo do banco com variavel({professor:professor})
    .populate("curso")
    .sort({ codigo: "desc" })
    .then(materias => {
      res.render("professor/view-notas", { materias: materias });
    })
    .catch(err => {
      req.flash("error_msg", "Houve um erro ao listar as materias");
      res.redirect("/professor");
    });
});

//Rota que Verifica Alunos Matriculados na Materia e Lista Eles
router.get("/materias/notas/edit/:id", eProfessor, async (req, res) => {
  Materia.findOne({ _id: req.params.id })
    .then(materia => {
      const matricula = []; //array de Alunos
      //for para colocar os alunos matriculados dentro dea variavel auxiliar matricula.
      for (var i = 0; i < materia.matriculados.length; i++) {
        matricula.push(materia.matriculados[i].user);
      }

      const discID = []; //Variavel auxiliar para guardar o id da materia

      discID.push({ text: materia._id });
      Usuario.find({ _id: matricula })
        .then(usuario => {
          res.render("professor/notas", {
            usuario: usuario,
            discID: discID
          });
        })
        .catch(err => {
          console.log(err);
          req.flash("error_msg", "Houve error interno ao testar");
          res.redirect("/");
        });
    })
    .catch(err => {
      console.log("err: ", err);
      req.flash(
        "error_msg",
        "Houve error ao carregar o formulario de lançamento"
      );
      res.redirect("/professor");
    });
});

module.exports = router;
