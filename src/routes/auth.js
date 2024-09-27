const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validations");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password, age, gender } = req.body;
  try {
    validateSignUpData(req);
    const passwordHash = await bcrypt.hash(password, 10);
    // const updatedData =
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
    });
    // await User.init();
    await user.save();
    res.send("User registered successfully");
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).send("Email already exists");
      return;
    } else {
      res.send(err.message);
    }
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send("Invalid Credentials");
    }
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(400).send("Invalid Credentials");
    }

    // Generate JWT token
    const token = await user.getJWT();

    // add Token to Cookie and send it response back to user

    res.cookie("token", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    res.send("Login successful");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

authRouter.post("/logout", async (req, res) => {
  //   res.clearCookie("token");
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logged out successfully");
});

module.exports = authRouter;
