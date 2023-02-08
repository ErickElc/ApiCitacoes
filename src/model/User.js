const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true, min: 3, max: 350 },
  age: { type: Number, required: true, min: 9, max: 120 },
  email: { type: String, required: true, min: 3, max: 200, unique: true },
  password: { type: String, required: true, min: 6, max: 400 },
  admin: { type: Boolean, default: false },
  createdUser: { type: Date, default: Date.now() },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
