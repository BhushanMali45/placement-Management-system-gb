// requiring the library
const mongoose = require("mongoose");

//connecting to the database
mongoose.connect(
 
  // "mongodb+srv://admin:admin123@cluster0.ljmczch.mongodb.net/?retryWrites=true&w=majority"
  

  "mongodb+srv://18minorpr:RSFJ0XHp7NxxtiRK@cluster0.ui5tb2s.mongodb.net/"
  // RSFJ0XHp7NxxtiRK

  // "mongodb://127.0.0.1:27017/mpr"
);

// acquiring the connection to check if it is succesfull
const db = mongoose.connection;

// checking for the error
db.on("error", console.error.bind(console, "error in connecting the database"));

// up and running then print the statement
db.once("open", () => {
  console.log("succesfully connected to database");
});

// exporting the connection
module.exports = db;
