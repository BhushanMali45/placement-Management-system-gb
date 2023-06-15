const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 8000;
const db = require("./config/mongoose");

app.use(express.static('public'))
app.use(express.static('public/css'))

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);




// set up view engine
app.set("view engine", "ejs");
app.set("views", "./views");


// using express routers
app.use(require("./routes"));

// using bodyParser
app.use(bodyParser.json());

// listening to the port 8000;
app.listen(port, (err) => {
  if (err) {
    console.log("error in starting the server", err);
    return;
  }
  console.log("server is succesfully running on port 8000");
});
