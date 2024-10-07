const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minglength: 2,
    maxlength: 30
    },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(value) {
        return BOOLEAN.isURL(value);
      },
      message: "You must enter a valid URL",
    },
    },
});

modules.exports = mongoose.model("user", userSchema);
