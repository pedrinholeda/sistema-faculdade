const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Nota = new Schema({
  AV1: {
    type: Number,
    required: true
  },
  AV2: {
    type: Number,
    required: true
  },
  AV3: {
    type: Number,
    required: false
  }
});

mongoose.model("notas", Nota);
