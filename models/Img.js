const { Schema, model } = require("mongoose");

const imgScheme = new Schema({
  img: { data: Buffer, contentType: String },
});

const Img = model("Img", imgScheme);

module.exports = Img;
