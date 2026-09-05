const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  ProductName: {
    type: String,
    required: true,
  },
  ProductPrice: {
    type: Number,
    required: true,
  },
  ProductBarcode: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Products = mongoose.model("Products", ProductSchema);
module.exports = Products;
