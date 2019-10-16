const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Nota = new Schema({
  av1: {
    type: Number,
    required: true
  },
  av2: {
    type: Number,
    required: true
  },
  materia: {
    type: Schema.Types.ObjectId,
    ref: "materias",
    required: true
  },
  semestre: {
    type: String,
    required: true
  }
});

mongoose.model("notas", Nota);
