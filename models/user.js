const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    usertype: {
      type: String,
      required: true,
      enum: ["college", "student", "company"],
    },

    mob: {
      type: Number,
      required: true,
    },
    
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


const User = new mongoose.model("User", userSchema);

module.exports = User;
