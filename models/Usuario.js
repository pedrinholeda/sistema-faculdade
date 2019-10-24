const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Usuario = new Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
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
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  notas: [
    {
      type: Schema.Types.ObjectId,
      ref: "notas"
    }
  ]
});

mongoose.model("usuarios", Usuario);
