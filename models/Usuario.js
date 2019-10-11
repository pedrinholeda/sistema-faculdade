const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Nota = new Schema({
  AV1: {
    type: String
  },
  AV2: {
    type: String
  },
  semestre: {
    type: String,
    required: true
  }
});

const Usuario = new Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  eAdmin: {
    type: Number,
    default: 0
  },
  senha: {
    type: String,
    required: true
  },
  notas: [Nota]
});

mongoose.model("usuarios", Usuario);
