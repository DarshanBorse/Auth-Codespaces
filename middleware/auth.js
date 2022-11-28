const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    // grab token from cookie
    const { token } = req.cookies;

    // if no token stop there
    if (!token) {
      return res.status(403).send("Please login first.");
    }

    // decode that token and get id
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decode._id;

    next();
  } catch (error) {
    console.log("Auth middleware", error);
    res.status(201).send("Invalid token");
  }
};

module.exports = auth;
