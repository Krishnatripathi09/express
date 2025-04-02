const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Please Enter Valid Gender");
        }
      },
    },
    email: {
      type: String,
      required: String,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please Enter Strong Password");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.signJWT = async function () {
  const user = this;

  const token = await jwt.sign({ id: user.id }, "MySecretKey", {
    expiresIn: "1h",
  });

  return token;
};

userSchema.methods.verifyPWD = async function (passwordInputByUser) {
  const user = this;

  const isValidPassword = await bcrypt.compare(
    passwordInputByUser,
    user.password
  );

  return isValidPassword;
};

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
