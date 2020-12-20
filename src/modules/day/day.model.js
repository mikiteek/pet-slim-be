const mongoose = require("mongoose");
const {Schema, ObjectId} = mongoose;
const {getDayProductsOptionsService} = require("./day.service");

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

async function getDayProducts(date, user)  {
  const options = getDayProductsOptionsService(date, user);
  const dayProducts = await this.aggregate(options)
  return dayProducts;
}

daySchema.statics.getDayProducts = getDayProducts;

module.exports = mongoose.model("Day", daySchema);