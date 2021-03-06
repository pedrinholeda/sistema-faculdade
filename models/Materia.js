const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Alunos = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "usuarios"
  },
  semestre: {
    type: String
  }
});

const Materia = new Schema({
  titulo: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  conteudo: {
    type: String,
    required: true
  },
  curso: {
    type: Schema.Types.ObjectId,
    ref: "cursos",
    required: true
  },
  codigo: {
    type: Number,
    require: true,
    unique: true
  },
  professor: {
    type: Schema.Types.ObjectId,
    ref: "usuarios",
    required: true
  },
  data: {
    type: Date,
    default: Date.now()
  },
  matriculados: [Alunos]
});

mongoose.model("materias", Materia);
