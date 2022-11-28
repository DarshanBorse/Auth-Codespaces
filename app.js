require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const User = require("./models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("<h1>Server is running.</h1>");
});

app.post("/register", async (req, res) => {
  try {
    // get all data from body
    const { firstName, lastName, email, password } = req.body;

    // Validation
    if (!(firstName && lastName && email && password)) {
      return res.status(400).send("All feilds are compulsory");
    }

    // check if user already register
    const userExists = await User.findOne({ email });

    // If user is exists then the folllowing condition will apply
    if (userExists) {
      return res.status(400).send("User already exists with this email.");
    }

    // encrypt password
    const hashPassword = await bcryptjs.hash(password, 10);

    // save the user in db
    const user = await User.create({ firstName, lastName, email, password: hashPassword });

    // generate a token for user and send it
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });

    user.token = token;
    user.password = undefined;

    return res.json({ success: true, message: "User successfully created.", user });
  } catch (error) {
    console.log("register", error);
  }
});

app.post("/login", async (req, res) => {
  try {
    // get all data from frontend
    const { email, password } = req.body;

    //validation
    if (!(email && password)) {
      return res.status(400).send("All feilds are compulsory");
    }

    // find user in db
    const user = await User.findOne({ email });

    // if user does not found then will apply following condition
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "The provided credentials do not match our records.",
      });
    }

    // match the password
    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "The provided credentials do not match our records.",
      });
    }

    // generate a token for user and send it
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });

    user.token = token;
    user.password = undefined;

    // options
    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    return res.status(200).cookie("token", token, options).json({ success: true, message: "User successfully login,", token });
  } catch (error) {
    console.log("login", error);
  }
});

module.exports = app;
