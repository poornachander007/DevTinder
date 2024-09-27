const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validations");
const bcrypt = require("bcrypt");
const validator = require("validator");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid update");
    }
    Object.keys(req.body).forEach(
      (update) => (user[update] = req.body[update])
    );
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const passwordHash = user.password;
    const { oldPassword, newPassword } = req.body;
    const isMatch = await bcrypt.compare(oldPassword, passwordHash);
    if (!isMatch) {
      throw new Error("Invalid old password");
    }
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error(
        "New password must be at least 8 characters long, contain a number, a lowercase letter, and an uppercase letter"
      );
    }
    const passwordHashNew = await bcrypt.hash(newPassword, 10);
    user.password = passwordHashNew;
    await user.save();
    res.send("Password updated successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = profileRouter;
