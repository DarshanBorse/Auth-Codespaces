require("dotenv").config();
require("./config/database").connect();
const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Server is running.</h1>");
});

app.post("/register", async (req, res) => {
  try {
    // get all data from body
    // All data should exists
    // check if user already register
    // encrypt password
    // save the user in db
    // generate a token for user and send it
  } catch (error) {
    console.log("register", error);
  }
});

module.exports = app;
