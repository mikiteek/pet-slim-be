const mongoose = require("mongoose");
const {Schema, ObjectId} = mongoose;

const userSchema = new Schema({
  name: String,
  email: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  credentials: [
    {
      source: String, // local, google, facebook,
      hashPass: String,
    }
  ],
  registerDate: {
    type: Date,
    default: Date.now,
  },
  summary: {
    type: ObjectId,
    ref: "Summary"
  },
  daysProducts: [
    {
      type: ObjectId,
      ref: "ConsumedProduct"
    }
  ]
});

module.exports = mongoose.model("User", userSchema);