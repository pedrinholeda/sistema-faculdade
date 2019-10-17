const mongoose = require("mongoose");
const express = require("express");

const Schema = mongoose.Schema;

const Postagem = new Schema({
  titulo: {
    type: String,
    require: true
  },
  slug: {
    type: String,
    require: true
  },
  topico: {
    type: String,
    required: true
  },
  conteudo: {
    type: String,
    required: true
  },
  materia: {
    type: Schema.Types.ObjectId,
    ref: "materias",
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model("postagens", Postagem);
