const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Curso");
require("../models/Materia");
require("../models/Usuario"); // em teste
const Materia = mongoose.model("materias");
const Curso = mongoose.model("cursos");
const Usuario = mongoose.model("usuarios"); // em teste
const { eAdmin } = require("../helpers/eAdmin"); // pega a função eAdmin dentro do objeto eAdmin

router.get("/", eAdmin, (req, res) => {
  res.render("admin/index");
});

router.get("/post", eAdmin, (req, res) => {
  res.send("Pagina de post");
});

//Rota que lista os cursos Cadastrados na Aplicação
router.get("/cursos", eAdmin, (req, res) => {
  Curso.find()
    .sort({ date: "desc" })
    .then(cursos => {
      res.render("admin/cursos", { cursos: cursos });
    })
    .catch(err => {
      req.flash("error_msg", "Houve um erro ao listar os cursos");
      res.redirect("/admin");
    });
});

//Rota que renderiza View de Add Curso
router.get("/cursos/add", eAdmin, (req, res) => {
  res.render("admin/addcursos");
});

//Rota de Logica de Add Curso (Com Validação)
router.post("/cursos/nova", eAdmin, (req, res) => {
  var erros = [];
  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  ) {
    erros.push({ texto: "Nome inválido" });
  }

  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  ) {
    erros.push({ texto: "Slug inválido" });
  }

  if (
    !req.body.descricao ||
    typeof req.body.descricao == undefined ||
    req.body.descricao == null
  ) {
    erros.push({ texto: "Descrição inválida" });
  }

  if (req.body.nome.length < 2) {
    erros.push({ texto: "O Nome do curso é muito pequeno" });
  }

  if (erros.length > 0) {
    res.render("admin/addcursos", { erros: erros });
  } else {
    const novaCurso = {
      nome: req.body.nome,
      slug: req.body.slug,
      descricao: req.body.descricao
    };
    new Curso(novaCurso)
      .save()
      .then(() => {
        req.flash("success_msg", "Curso criado com sucesso!");
        res.redirect("/admin/cursos");
      })
      .catch(err => {
        req.flash(
          "error_msg",
          "Houve um erro ao salvar o curso, tente novamente!"
        );
        res.redirect("/admin");
      });
  }
});

//Rota de View de Edit Curso (passando id por parametro)
router.get("/cursos/edit/:id", eAdmin, (req, res) => {
  Curso.findOne({ _id: req.params.id })
    .then(curso => {
      res.render("admin/editcursos", { curso: curso });
    })
    .catch(err => {
      req.flash("error_msg", "Este curso não existe");
      res.redirect("/admin/cursos");
    });
});

//Rota de Logica de Edit Curso (passando id por parametro)
router.post("/cursos/edit", eAdmin, (req, res) => {
  Curso.findOne({ _id: req.body.id })
    .then(curso => {
      curso.nome = req.body.nome;
      curso.slug = req.body.slug;
      curso.descricao = req.body.descricao;

      curso
        .save()
        .then(() => {
          req.flash("success_msg", "Curso editado com sucesso!");
          res.redirect("/admin/cursos");
        })
        .catch(err => {
          req.flash("error_msg", "Houve um erro ao editar o curso");
          res.redirect("/admin/cursos");
        });
    })
    .catch(err => {
      req.flash("error_msg", "Houve um erro ao editar o curso");
      res.redirect("/admin/cursos");
    });
});

//Rota de Deletar Curso
router.post("/cursos/deletar", eAdmin, (req, res) => {
  Curso.deleteOne({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Curso deletado com sucesso!");
      res.redirect("/admin/cursos");
    })
    .catch(err => {
      req.flash("error_msg", "Houve um erro ao deletar o curso");
      res.redirect("/admin/cursos");
    });
});

//Rota que lista os Materias Cadastradas na Aplicação
router.get("/materias", eAdmin, (req, res) => {
  Materia.find()
    .populate("curso")
    .sort({ data: "desc" })
    .then(materias => {
      res.render("admin/materias", { materias: materias });
    })
    .catch(err => {
      req.flash("error_msg", "Houve um erro ao listar as materias");
      res.redirect("/admin");
    });
});

//Rota de View para Add Materias
router.get("/materias/add", eAdmin, (req, res) => {
  Curso.find()
    .then(cursos => {
      if (cursos) {
        Usuario.find({ eProfessor: true }).then(usuarios => {
          res.render("admin/addmateria", {
            cursos: cursos,
            usuarios: usuarios
          });
        });
      }
    })
    .catch(err => {
      req.flash("error_msg", "Houve um erro ao carregar o formulario :( ");
      res.redirect("/admin");
    });
  // Usuario.find().then(usuarios => {
  //   // em teste
  //   res.render("admin/addmateria", { usuarios: usuarios }); // em teste
  // });
});

//Rota de Logica para Add Materias (pegando id por parametro)
router.post("/materias/nova", eAdmin, (req, res) => {
  var erros = [];
  if (req.body.curso == "0") {
    erros.push({ texto: "Curso inválida, registre um curso" });
  }

  if (erros.length > 0) {
    res.render("admin/addmateria", { erros: erros });
  } else {
    const novaMateria = {
      titulo: req.body.titulo,
      codigo: req.body.codigo,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      curso: req.body.curso,
      professor: req.body.professor,
      slug: req.body.slug
    };

    new Materia(novaMateria)
      .save()
      .then(() => {
        req.flash("success_msg", "Materia criada com sucesso!");
        res.redirect("/admin/materias");
      })
      .catch(err => {
        console.log(err);
        req.flash("error_msg", "Houve um erro durante o salvamento da materia");
        res.redirect("/admin/materias");
      });
  }
});

//Rota de View para Edit Materia (pegando id por parametro)
router.get("/materias/edit/:id", eAdmin, (req, res) => {
  Materia.findOne({ _id: req.params.id })
    .then(materia => {
      Curso.find()
        .then(cursos => {
          Usuario.find({ eProfessor: true }).then(usuarios => {
            res.render("admin/editmaterias", {
              cursos: cursos,
              materia: materia,
              usuarios: usuarios
            });
          });
        })

        .catch(err => {
          req.flash("error_msg", "Houve um erro ao listar as cursos");
          res.redirect("/admin/materias");
        });
    })
    .catch(err => {
      req.flash(
        "error_msg",
        "Houve um erro ao carregar o formulario de edição"
      );
      res.redirect("/admin/materias");
    });
});

//Rota de Logica para Edit Materias
router.post("/materia/edit", eAdmin, (req, res) => {
  Materia.findOne({ _id: req.body.id })
    .then(materia => {
      materia.titulo = req.body.titulo;
      materia.slug = req.body.slug;
      materia.descricao = req.body.descricao;
      materia.professor = req.body.professor;
      materia.conteudo = req.body.conteudo;
      materia.curso = req.body.curso;

      materia.save().then(() => {
        req.flash("success_msg", "Materia editada com sucesso!");
        res.redirect("/admin/materias");
      });
    })
    .catch(err => {
      req.flash("error_msg", "Erro interno");
      res.redirect("/admin/materias");
    })
    .catch(err => {
      req.flash("error_msg", "Houve um erro ao salvar a edição");
      res.redirect("/admin/materias");
    });
});

//Rota de Deletar Materia
router.get("/materias/deletar/:id", eAdmin, (req, res) => {
  Materia.deleteOne({ _id: req.params.id })
    .then(() => {
      req.flash("success_msg", "Materia deletada com sucesso");
      res.redirect("/admin/materias");
    })
    .catch(err => {
      req.flash("error_msg", "Houve um erro interno");
      res.redirect("/admin/materias");
    });
});

// //rota para mostrar ao professor suas disciplinas
// router.get("/:disciplinaId", async (req, res) => {
//   const professor = req.params.disciplinaId;
//   try {
//     const disciplina = await Disciplina.find({ professor });
//     return res.send({ disciplina });
//   } catch (err) {
//     console.log(err);
//     return res.status(400).send({ error: "Error, loading disciplina" });
//   }
// });

// Rota de View de Materias Disponiveis para matricular Alunos
router.get("/alunos-materias", eAdmin, (req, res) => {
  Materia.find()
    .populate("curso")
    .sort({ data: "desc" })
    .then(materias => {
      res.render("admin/alunos-materias", { materias: materias });
    })
    .catch(err => {
      req.flash("error_msg", "Houve um erro ao listar as materias");
      res.redirect("/admin");
    });
});

//Rota para validar e cadastrar alunos em uma materia
router.get("/materias/alunos-materias/:id", eAdmin, (req, res) => {
  Materia.findOne({ _id: req.params.id })
    .then(materia => {
      Usuario.find({ eAdmin: false, eProfessor: false })
        .then(usuarios => {
          res.render("admin/addaluno", {
            usuarios: usuarios,
            materia: materia
          });
        })
        .catch(err => {
          req.flash("error_msg", "Houve error ao listar os alunos");
          res.redirect("/admin");
        });
    })
    .catch(err => {
      req.flash(
        "error_msg",
        "Houve error ao carregar o formulario de matricula"
      );
      res.redirect("/admin");
    });
});

//Rota de Logica para add aluno
router.post("/materias/addaluno", eAdmin, async (req, res) => {
  Materia.findOne({ _id: req.body.id })
    .then(materia => {
      const alun = req.body.matricula;
      const semestre = req.body.semestre;
      //const matricula = disciplina.matriculados;
      const erros = [];
      for (var i = 0; i < materia.matriculados.length; i++) {
        if (
          alun == materia.matriculados[i].user &&
          semestre == materia.matriculados[i].semestre
        ) {
          erros.push({ texto: "Aluno ja matriculado" });
          break;
        }
      }
      if (erros.length > 0) {
        req.flash("error_msg", "Aluno ja matriculado");
        res.redirect("/admin/alunos-materias");
      } else {
        //salvando aluno na disciplina
        const NomeDisc = materia.titulo;

        Usuario.findOne({ _id: alun }).then(usuario => {
          usuario.notas.push({
            nota: 0,
            materia: NomeDisc,
            semestre: semestre
          });

          usuario
            .save()
            .then(() => {})
            .catch(err => {
              console.log("error ao adicionar disciplina ao aluno: ", err);
              res.redirect("/admin/alunos-materias");
            });
        });
        materia.matriculados.push({
          user: alun,
          semestre: semestre
        });
        materia
          .save()
          .then(() => {
            req.flash("success_msg", "Aluno matriculado com sucesso");
            res.redirect("/admin/alunos-materias");
          })
          .catch(err => {
            req.flash("error_msg", "Houve erro ao salvar a matricula");
            res.redirect("/admin/alunos-materias");
          });
        //res.redirect("/admin/disciplinas");
      }
    })
    .catch(err => {
      console.log("err: ", err);
      req.flash("error_msg", "Houve um error ao editar a matricula");
      res.redirect("/admin/alunos-materias");
    });
});

module.exports = router;
