const mongoose = require("mongoose");
const express = require("express");

const Schema = mongoose.Schema;

const Curso = new Schema({
  nome: {
    type: String,
    require: true
  },
  slug: {
    type: String,
    require: true
  },
  descricao: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model("cursos", Curso);
