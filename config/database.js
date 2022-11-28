const { default: mongoose } = require("mongoose");

const URI = process.env.MONGODB_URL;

exports.connect = () => {
  mongoose
    .connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then()
    .catch((error) => {
      console.log("DB connection failed.");
      console.log(error);
      process.exit(1);
    });
};
