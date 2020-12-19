const mongoose = require("mongoose");
const {Schema, ObjectId} = mongoose;

const daySchema = new Schema({
  product: {
    type: ObjectId,
    ref: "Product"
  },
  weight: Number,
  date: Date,
  user: {
    type: ObjectId,
    ref: "User",
  }
});

module.exports = mongoose.model("Day", daySchema);