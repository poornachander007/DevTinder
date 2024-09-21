const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://poornachander007:poornachander007_cluster0@cluster0.s9f3pdn.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
