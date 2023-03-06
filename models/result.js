const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config/database");

const resultSchema = mongoose.Schema({
  event: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  mark: {
    type: Number,
    required: true,
  },
  position:{
    type:Number,
    required:true
  }
});

const Result = (module.exports = mongoose.model("Result", resultSchema));
