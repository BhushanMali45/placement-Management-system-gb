const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    resume: {
      type: String,
      required: true,
    },

    company: {
        type: String,
        required: true,
      },


    jobPost: {
        type: String,
        required: true,
      },
 
  },
  {
    timestamps: true,
  }
);

const Application = new mongoose.model("Application", applicationSchema);

module.exports = Application;
