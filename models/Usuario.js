const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  eProfessor: {
    type: Number,
    default: 0
  },
  senha: {
    type: String,
    required: true
  },
  notas: [
    {
      type: Schema.Types.ObjectId,
      ref: "notas"
    }
  ]
});

mongoose.model("usuarios", Usuario);
