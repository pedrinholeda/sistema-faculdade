const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  data: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model("materias", Materia);
