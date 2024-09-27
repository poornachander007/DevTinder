const express = require("express");
const connectDB = require("./config/database");

const app = express();

const cookieParser = require("cookie-parser");
const JWT = require("jsonwebtoken");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

const initiolizeServerAndConnectDB = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected...");
    app.listen(3333, () => {
      console.log(
        `Server started and listening on port : http://localhost:3333`
      );
    });
  } catch (err) {
    console.error("Error connecting to MongoDB: ", err);
    process.exit(1); // Exit the process with an error status
  }
};

initiolizeServerAndConnectDB();
