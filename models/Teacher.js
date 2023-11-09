const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  teacherSubject: {
    type: String,
  },
  isTeacherAvailableForTuition: {
    type: String,
  },
  targetStudent: {
    strings: [String],
  },
  targetSubject: {
    strings: [String],
  },
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
