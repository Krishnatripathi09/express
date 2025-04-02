const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/admin");
const { connectDB } = require("./config/database");
const { User } = require("./models/userSchema");
const { validateSignUpData } = require("./utils/validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profileRouter");
const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = 3000;

connectDB()
  .then(() => {
    console.log("connection to DataBase SuccessFull");

    app.listen(PORT, () => {
      console.log(`Server is Listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/", authRouter);
app.use("/", profileRouter);
