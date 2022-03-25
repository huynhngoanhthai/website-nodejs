const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A product must have a name"],
  },
  description: String,
  price: {
    type: Number,
    required: [true, "A product must have a price"],
  },
  // imageCover: {
  //   type: String,
  //   required: [true, "A product must have a cover image"],
  // },
  images: [String],
});

module.exports = mongoose.model("Product", productSchema);
