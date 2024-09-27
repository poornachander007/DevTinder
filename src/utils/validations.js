const bcrypt = require("bcrypt");
const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  try {
    if (!firstName || !lastName) {
      throw new Error("Invalid first name or last name");
    }
    if (!validator.isEmail(emailId)) {
      console.log("Invalid email");
      throw new Error("Invalid email format");
    }
    if (!validator.isStrongPassword(password)) {
      throw new Error(
        "Password must be at least 8 characters long, contain a number, a lowercase letter, and an uppercase letter"
      );
    }
  } catch (e) {
    throw new Error("Error :  " + e.message);
  }
};

const validateEditProfileData = (req) => {
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "gender",
    "photoUrl",
    "skills",
  ];
  const updates = Object.keys(req.body);
  const isValidUpdate = updates.every((update) =>
    ALLOWED_UPDATES.includes(update)
  );
  return isValidUpdate;
};

module.exports = { validateSignUpData, validateEditProfileData };
