const mongoose = require("mongoose");
const {Schema} = mongoose;

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
});

module.exports = mongoose.model("User", userSchema);