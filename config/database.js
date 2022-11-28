const { default: mongoose } = require("mongoose");

const URI = process.env.MONGODB_URL;

exports.connect = () => {
  mongoose
    .connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database connection is successfully.");
    })
    .catch((error) => {
      console.log("DB connection failed.");
      console.log(error);
      process.exit(1);
    });
};
