const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  video_data: { type: String, required: true }
});
module.exports = mongoose.model("course", CourseSchema);
