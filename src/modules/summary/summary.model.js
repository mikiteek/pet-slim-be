const mongoose = require("mongoose");
const {Schema, ObjectId} = mongoose;

const summarySchema = new Schema({
  userId: {
    type: ObjectId,
  },
  height: Number,
  age: Number,
  currentWeight: Number,
  targetWeight: Number,
  bloodType: Number,
  dayNormCalories: Number,
  notAllowedCategories: [String],
});

module.exports = mongoose.model("Summary", summarySchema);