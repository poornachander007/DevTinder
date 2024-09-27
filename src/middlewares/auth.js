const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      throw new Error("Unauthorized access");
    }
    const decoded = await jwt.verify(token, "PCR_SECRET_KEY");
    const user = await User.findById(decoded._id);
    if (!user) {
      throw new Error("Unauthorized access");
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = { userAuth };
