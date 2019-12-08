const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  facebookID: { type: String, unique: true },
  googleID: { type: String, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: { type: String, required: true },
  picture: String
});
module.exports = mongoose.model("users", UserSchema);
