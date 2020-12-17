const mongoose = require("mongoose");
const {Schema} = mongoose;

const productSchema = new Schema({
  categories: [{type: String}],
  weight: {type: Number, default: 100},
  title: {ru: String, ua: String},
  calories: {type: Number},
  groupBloodNotAllowed: {1: Boolean, 2: Boolean, 3: Boolean, 4: Boolean},
});


module.exports = mongoose.model("Product", productSchema);