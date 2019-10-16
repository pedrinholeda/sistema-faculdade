const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Curso");
require("../models/Materia");
require("../models/Usuario"); // em teste
const Materia = mongoose.model("materias");
const Curso = mongoose.model("cursos");
const Usuario = mongoose.model("usuarios"); // em teste
const { eProfessor } = require("../helpers/eProfessor");

router.get("/", eProfessor, (req, res) => {
  res.render("professor/index");
});

module.exports = router;
