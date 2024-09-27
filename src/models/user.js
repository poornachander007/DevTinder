const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, minLength: 4, maxLength: 50 },
    lastName: { type: String },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
          );
        }
      },
    },
    age: { type: Number, required: true, min: 18 },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Invalid gender. Must be male, female, or other.");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/black-white-image-mans-face-with-jacket-his-shoulder_1240970-21695.jpg?w=740",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid image URL: " + value);
        }
      },
    },
    skills: { type: [String] },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "PCR_SECRET_KEY", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordUserInput) {
  const user = this;
  const passwordHash = user.password;
  const isValid = await bcrypt.compare(passwordUserInput, passwordHash);
  return isValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
