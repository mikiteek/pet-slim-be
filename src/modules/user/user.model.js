const mongoose = require("mongoose");
const {Schema, ObjectId} = mongoose;

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
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
  daysProducts: [
    {
      type: ObjectId,
      ref: "Day"
    }
  ]
});

module.exports = mongoose.model("User", userSchema);