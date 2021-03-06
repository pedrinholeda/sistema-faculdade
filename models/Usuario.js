const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Nota = new Schema({
  nota: {
    type: Number
  },
  materia: {
    type: String
  },
  semestre: {
    type: String
  }
});

const Usuario = new Schema(
  {
    foto: String,

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
    telefone: {
      type: String,
      required: false,
      default: "(61) 9999-9999"
    },
    profissao: {
      type: String,
      required: false,
      default: "Nenhuma"
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
    notas: [Nota]
  }
  //,
  // {
  //   toJSON: {
  //     virtuals: true
  //   }
  // }
);

// Usuario.virtual("foto_url".length).get(function() {
//   return `http://localhost:8081/files/${this.foto}`;
// });

mongoose.model("usuarios", Usuario);
