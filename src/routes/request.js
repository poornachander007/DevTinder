const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post("/request", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + "  :  Sent Request to someone..");
  } catch (err) {
    res.status(401).send("Unauthorized");
  }
});

module.exports = requestRouter;
